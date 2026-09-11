#!/usr/bin/env python3
"""
WordPress → Firestore bridge: syncs new published posts from blog.kraftmortgages.ca
to Firestore so they appear on kraftmortgages.ca/blog.

Run manually:  python3 wp-to-firestore-bridge.py
Or as cron:    */15 * * * * cd /home/varun7676/kraft-scripts && python3 scripts/wp-to-firestore-bridge.py >> /tmp/wp-bridge.log 2>&1
"""
import json, os, sys, base64, re, urllib.request, urllib.error, datetime, hashlib

# ─── CONFIG ──────────────────────────────────────────────────────────────────
WP_URL = "https://blog.kraftmortgages.ca/wp-json/wp/v2/posts"
WP_USER = "admin"
WP_PASS = "KCO9 Su0m Z7V5 4Qkc D0eT 4oMg"
STATE_FILE = os.path.expanduser("~/.hermes/wp-bridge-state.json")
FIREBASE_KEY = os.path.expanduser("~/.hermes/firebase-key.json")
# ─────────────────────────────────────────────────────────────────────────────

def wp_auth_header():
    raw = f"{WP_USER}:{WP_PASS}"
    return f"Basic {base64.b64encode(raw.encode()).decode()}"

def fetch_wp_posts(after_date=None):
    """Fetch published posts from WordPress, optionally after a date."""
    params = "?status=publish&per_page=50&_fields=id,date,slug,title,content,excerpt,meta,categories"
    if after_date:
        # WordPress REST API expects MySQL format YYYY-MM-DD HH:MM:SS
        after_str = after_date.strftime("%Y-%m-%dT%H:%M:%S")
        params += f"&after={after_str}"
    url = WP_URL + params
    req = urllib.request.Request(url, headers={"Authorization": wp_auth_header()})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  WP fetch error {e.code}: {e.read().decode()[:200]}")
        return []

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return {"synced_ids": [], "last_sync": None}

def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

def slugify(text):
    """Generate a URL-safe slug from text."""
    slug = text.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug[:80].strip('-')

def extract_meta_description(content):
    """Try to extract first meaningful paragraph for meta description."""
    text = re.sub(r'<[^>]+>', ' ', content)
    text = re.sub(r'\s+', ' ', text).strip()
    # First ~155 chars
    return text[:155] if text else ""

def wp_post_to_firestore_doc(post):
    """Convert a WordPress post dict to the Firestore Post format."""
    title = post.get("title", {}).get("rendered", "Untitled")
    content = post.get("content", {}).get("rendered", "")
    excerpt_raw = post.get("excerpt", {}).get("rendered", "")
    excerpt = re.sub(r'<[^>]+>', '', excerpt_raw).strip()
    slug = post.get("slug", slugify(title))
    
    # Parse categories from WordPress (we get IDs, but we'll use content-based)
    raw_date = post.get("date", "")
    try:
        pub_date = datetime.datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
    except:
        pub_date = datetime.datetime.now(datetime.timezone.utc)

    return {
        "slug": slug,
        "title": title,
        "markdown": content,  # stores HTML (as existing codebase expects)
        "html": content,
        "status": "published",
        "publishedAt": pub_date.isoformat(),
        "author": {
            "name": "Varun Chaudhry",
            "title": "Licensed Mortgage Broker",
            "license": "BCFSA #SR220230 | RECA LIC-00655428 | FSRA #12918",
        },
        "metaDescription": excerpt or extract_meta_description(content),
        "keywords": [],
        "categories": ["Mortgage Guides"],
    }

def push_to_firestore(doc):
    """Write a single post doc to Firestore 'posts' collection using the Firebase Admin SDK."""
    import firebase_admin
    from firebase_admin import credentials, firestore

    if not firebase_admin._apps.get("wp-bridge", None):
        cred = credentials.Certificate(FIREBASE_KEY)
        firebase_admin.initialize_app(cred, name="wp-bridge")

    db = firestore.client(app=firebase_admin.get_app(name="wp-bridge"))
    slug = doc["slug"]

    # Convert publishedAt back to a Timestamp
    if isinstance(doc["publishedAt"], str):
        try:
            dt = datetime.datetime.fromisoformat(doc["publishedAt"])
            doc["publishedAt"] = firestore.SERVER_TIMESTAMP
        except:
            doc["publishedAt"] = firestore.SERVER_TIMESTAMP

    db.collection("posts").document(slug).set(doc, merge=True)
    return slug

def main():
    print(f"[{datetime.datetime.now().isoformat()}] WP→Firestore bridge starting...")
    
    state = load_state()
    synced_ids = set(state.get("synced_ids", []))

    # Determine cutoff date: if we've synced before, only fetch newer posts
    after_date = None
    if state.get("last_sync"):
        try:
            after_date = datetime.datetime.fromisoformat(state["last_sync"])
        except:
            pass

    posts = fetch_wp_posts(after_date=after_date)
    if not posts:
        print("  No new posts found.")
        return

    # Filter out already-synced posts
    new_posts = [p for p in posts if str(p["id"]) not in synced_ids]
    if not new_posts:
        print(f"  {len(posts)} posts found, all already synced.")
        state["last_sync"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
        save_state(state)
        return

    print(f"  Found {len(new_posts)} new post(s) to sync...")

    success_count = 0
    for wp_post in new_posts:
        wp_id = str(wp_post["id"])
        title = wp_post.get("title", {}).get("rendered", "?")
        slug = wp_post.get("slug", "?")
        try:
            doc = wp_post_to_firestore_doc(wp_post)
            synced_slug = push_to_firestore(doc)
            synced_ids.add(wp_id)
            success_count += 1
            print(f"  ✅ Synced: \"{title}\" → /blog/{synced_slug}")
        except Exception as e:
            print(f"  ❌ Failed: \"{title}\" — {e}")

    # Update state
    state["synced_ids"] = list(synced_ids)
    state["last_sync"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    save_state(state)

    print(f"  Done. {success_count}/{len(new_posts)} synced successfully.")
    print(f"  Next sync will check for posts after {state['last_sync']}")

if __name__ == "__main__":
    main()
