# Postiz API Configuration
## Kraft Mortgages — Content Scheduling

### API Credentials
- **Base URL:** `https://postiz.zamna.me`
- **API Key:** `e7a3da0e78bcbdca73a820b49fd8ef6bf67ddc9e1406fa758cd406a851192980`
- **MCP Endpoint:** `https://postiz.zamna.me/api/mcp/e7a3da0e78bcbdca73a820b49fd8ef6bf67ddc9e1406fa758cd406a851192980`

### Connected Channel IDs

| Channel ID | Platform | Account | Handle |
|------------|----------|---------|--------|
| `cmmsgtt180001o4792pxe5ve7` | X (Twitter) | Varun Chaudhry | @VarunChaud25409 |
| `cmmx5g9jv0001lj6mjs9w8f0m` | Instagram | Varun Chaudhry | @varun18870 |
| `cmmx45rji0003uk6fmcghv5rz` | LinkedIn Page | Kraft Mortgages Canada Inc. | kraft-mortgages-canada-inc- |
| `cmmx40n6b0001uk6f5gkdlwye` | LinkedIn Personal | Varun Chaudhry | varunchaudhry18589 |

### Missing Channels (need to connect)
- ❌ Kraft Mortgages Facebook Page (not yet connected)
- ❌ Kraft Mortgages Instagram (blocked — Meta Business Portfolio issue)

### API Usage Examples

**Schedule a post:**
```bash
curl -X POST https://postiz.zamna.me/api/posts \
  -H "Authorization: Bearer e7a3da0e78bcbdca73a820b49fd8ef6bf67ddc9e1406fa758cd406a851192980" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "schedule",
    "date": "2026-03-25T09:00:00.000Z",
    "integrations": [{"id": "CHANNEL_ID"}],
    "content": [{"content": "Post text here", "id": "CHANNEL_ID"}]
  }'
```

**List posts:**
```bash
curl https://postiz.zamna.me/api/posts \
  -H "Authorization: Bearer e7a3da0e78bcbdca73a820b49fd8ef6bf67ddc9e1406fa758cd406a851192980"
```

### MCP Integration (for Sifra / OpenClaw)
Add this MCP endpoint to OpenClaw's MCP config:
```
URL: https://postiz.zamna.me/api/mcp/e7a3da0e78bcbdca73a820b49fd8ef6bf67ddc9e1406fa758cd406a851192980
Transport: HTTP Streaming (SSE)
```
This gives Sifra direct tools to create, schedule, and manage posts without browser automation.

### Content Hub (Google Sheet)
- **Sheet ID:** `1p9m4wt-V-Ko1mSZeu0Fvur58x6bXzN-Zttxj3ouP3zA`
- **URL:** https://docs.google.com/spreadsheets/d/1p9m4wt-V-Ko1mSZeu0Fvur58x6bXzN-Zttxj3ouP3zA/edit
- **Tabs:** Social Queue (26 posts), Blog Queue (8 posts), SEO Keywords (15), Sifra Handover (10 tasks)

### Content → Channel Mapping (from Social Queue)
| Platform Label in Sheet | Channel ID to use |
|------------------------|-------------------|
| LinkedIn (Kraft) | `cmmx45rji0003uk6fmcghv5rz` |
| LinkedIn (Varun) | `cmmx40n6b0001uk6f5gkdlwye` |
| Instagram (Varun) | `cmmx5g9jv0001lj6mjs9w8f0m` |
| X (Varun) | `cmmsgtt180001o4792pxe5ve7` |
