/**
 * APPROVED DIRECTORIES & ATTACHMENTS FOR CANADIAN LENDERS
 * Auto-extracted from official Canadian lender spreadsheets & guidelines
 */

export interface DirectoryAppraiserItem {
  firm: string;
  address?: string;
  city?: string;
  province?: string;
  phone?: string;
}

export interface DirectoryLawyerItem {
  category: string;
  region: string;
  type: string;
  name: string;
  address: string;
}

export interface LenderAttachmentItem {
  title: string;
  fileName: string;
  localPath: string;
  remoteUrl: string;
  format: 'PDF' | 'XLSX' | 'XLS' | 'DOC' | 'DOCX';
  fileSize: string;
  itemCount?: number;
  description: string;
}

export const PROSPERA_APPROVED_LAWYERS: DirectoryLawyerItem[] = [
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Acorn Law Corporation",
    "address": "202-3320 Richter Street"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "A.S. Mattoo & Associates Law Office (Trust)",
    "address": "7928 128 St Unit 211"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Alpine Legal Services",
    "address": "#12 8465 Harvard Pl"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Amarjit K Kler Notary Corporation In Trust",
    "address": "1538 Foster St Unit 201"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Amin Savji Notary Corp Trust Account",
    "address": "328 Gilmore Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Amy Badesha Notary Corporation DBA Badesha & Associates",
    "address": "#100-3240 Mt Lehman Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "ATAC Law Corporation In Trust",
    "address": "4300 North Fraser Way Unit 127"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Aubin & Associates Notaries Public",
    "address": "203-125 Highway 33 East"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Bailey & Morrison",
    "address": "902 - 1708 Dolphin Avenue"
  },
  {
    "category": "Commercial",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Bailey Morrison",
    "address": "902-1708 Dolphin Avenue"
  },
  {
    "category": "Commercial",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Baker Newby LLP (Abbotsford Office)",
    "address": "200 - 2955 Gladwin Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Baker Newby LLP (Abbotsford Office)",
    "address": "200 - 2955 Gladwin Rd"
  },
  {
    "category": "Commercial",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Baker Newby LLP (Chilliwack Office)",
    "address": "9259 Main St"
  },
  {
    "category": "Leasehold",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Baker Newby LLP (Chilliwack Office)",
    "address": "9259 Main St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Bart Aldrich Notary Corporation Trust Account",
    "address": "2655 Mary Hill Rd Unit 105"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Bell Alliance, Lawyers & Notaries Public",
    "address": "201 - 1367 West Broadway"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Bell Jacoe & Company",
    "address": "13211 North Victoria Rd"
  },
  {
    "category": "Leasehold",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Benson Law LLP",
    "address": "270 Highway 33 W"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Benson Law LLP",
    "address": "270 Highway 33 W"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Bertoldi & Company Legal Services In Trust",
    "address": "675 Hastings St W Unit 816"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Binpal & Associates",
    "address": "215 - 13737 72nd Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Blakely & Company",
    "address": "201 - 2595 Pleasant Valley Blvd"
  },
  {
    "category": "Commercial",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Boughton Law",
    "address": "700 - 595 Burrard St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Boyle & Company",
    "address": "201 - 100 Front St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Brawn Karras & Sanderson",
    "address": "309 - 1688 152nd St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Brendon Rothwell, Notary Public",
    "address": "#102-546 Leon Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Brentwood Town Notary Public In Trust",
    "address": "2025 Willingdon Ave Suite 900"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Brooke Downs Venard LLP",
    "address": "51 3rd St NE"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Bryshun Mace Lawyers",
    "address": "#304-3330 Richter St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "BTM Lawyers LLP Trust",
    "address": "130 Brew St Unit 530"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Buckley Hogan In Trust",
    "address": "8120 128th St Suite 200"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "C W Dupuis Ltd",
    "address": "313 Sixth St Unit 103"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Cammack Hepner Notary Corporation In Trust",
    "address": "1656 Martin Dr Suite 106"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Campbell Redmond",
    "address": "10388 Whalley Blvd, 2nd Floor"
  },
  {
    "category": "Commercial",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Cascade Law Corporation",
    "address": "300 - 2777 Gladwin Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Cascade Law Corporation",
    "address": "300 - 2777 Gladwin Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Cassady & Company Trust",
    "address": "522 Seventh St Unit 330"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Cassandra Coolin Notary Corporation Trust",
    "address": "22720 Lougheed Hwy"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "CBM Lawyers (formerly Campbell Burton & McMullan)",
    "address": "200 - 4769 222nd St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Centra Lawyers LLP Trust Account",
    "address": "20110 Lougheed Hwy Unit 102"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Central City Law Corporation In Trust",
    "address": "10153 King George Blvd Unit 1139"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Charlene Hood Notary Public, Trust Account",
    "address": "7081 120th St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Charlene Silvester, Notary Public",
    "address": "3003 30th Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Chelsea Kramer Notary Public",
    "address": "#101-5415 26th Street"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Cherkowski Marsden LLP",
    "address": "#201-2928 29th St"
  },
  {
    "category": "Commercial",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Cherkowski Marsden LLP",
    "address": "201, 2928 \u2013 29 Street"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Cheryl Bennewith Notary Public Trust Account",
    "address": "22366 McIntosh Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Christine Duncan Notary Public Inc.",
    "address": "102-483 Main Street"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Claudia Leca Notary Public Inc. In Trust",
    "address": "9940 Lougheed Hwy Unit 303"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Clayton Heights Notary",
    "address": "#105 6758 188 St"
  },
  {
    "category": "Leasehold - First Nations",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Clear Path Law Group",
    "address": "201-45619 Yale Road"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Cleveland Doan LLP In Trust",
    "address": "1321 Johnston Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Cobbett & Cotton Law Corporation",
    "address": "300-410 Careton Avenue"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Columbia Square Law Office",
    "address": "837 Carnarvon St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Compass Law Corporation",
    "address": "2 - 3302 30th Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Dan J Campbell, Notary Public",
    "address": "201 - 2286 McCallum Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "David Watts Notary Corporation",
    "address": "1412-675 W.Hastings St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Davidson Pringle LLP",
    "address": "3009 28 St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Debra Burden, Notary Public",
    "address": "3017A 30th Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Devinder K. Sidhu Law Corporation",
    "address": "1518 George Street"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Dhami Narang & Company LLP",
    "address": "301-2975 Gladwin Road"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "DKS Law Corporation",
    "address": "1518 George Street"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Doak Shirreff LLP",
    "address": "200 - 537 Leon Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Drysdale Bacon McStravick LLP In Trust",
    "address": "1015 Austin Ave Suite 211"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Edwin Chan Law Corporation In Trust",
    "address": "4720 Kingsway Unit 2600"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Elyssa Lockhart Law Corporation",
    "address": "7330 Horne St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Farinaz Kovacevic Notary Corporation In Trust",
    "address": "1064 Austin Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Farris Vaughan Wills & Murphy LLP",
    "address": "800 - 1708 Dolphin Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Fedewich & Witt, Notaries Public",
    "address": "5661 176A St"
  },
  {
    "category": "Commercial",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "FH&P Lawyers LLP",
    "address": "400-275 Lawrence Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "FH&P Lawyers LLP",
    "address": "400 - 275 Lawrence Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Fraserwest Law Group",
    "address": "9202 Young Rd"
  },
  {
    "category": "Commercial",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Fraserwest Law Group LLP",
    "address": "9202 Young Rd"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Fulton & Company LLP",
    "address": "300 - 350 Lansdowne St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Garton & Harris Trust Account",
    "address": "1542 Prairie Avenue"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Gilchrist & Company",
    "address": "101 - 123 Martin St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Glazier & Polley",
    "address": "1674 Bertram St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Golbey Law Corporation Trust",
    "address": "2707 Clarke St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Goodwin & Mark LLP Trust Account",
    "address": "713 Columbia St Unit 217"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Grant Sauer Notary Corporation",
    "address": "5B-8880 202St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Gregg Alfonso Law Corporation",
    "address": "201-1180 Sunset Drive"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Gregory J Litwin, Notary Public",
    "address": "1 - 699 Main St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Hamilton Duncan Armstrong Stewart Law Corporation",
    "address": "13401 108th Ave Unit 1450"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Harbir K. Deol Notary Corp.",
    "address": "13049 76 Ave Unit 110"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Harman Virk Notary Public",
    "address": "1 - 2712 Clearbrook Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Hashmi & Company Barristers Solicitors & Notaries Public Inc. Trust Account",
    "address": "10491 135A St"
  },
  {
    "category": "Retail",
    "region": "Spectrum \u2013 Retail",
    "type": "Lawyer",
    "name": "Imperium Law Corporation",
    "address": "#350 - 10524 King George Blvd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Jacqueline Tait, Notary Public",
    "address": "#1-45766 Patten Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "James L. Robinson Trust Account",
    "address": "1140 Austin Ave Suite 240"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Jennette Vopicka",
    "address": "#202-3320 Richter Street"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Johnston Goodrich Lawyers",
    "address": "9921 Main St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Jonathan Fowler Law Corporation",
    "address": "3711 James Street"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Judith Piccolo, Notary Public",
    "address": "20416 Douglas Cres"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Kaler Law Corporation",
    "address": "102A 32544 George Ferguson Way"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Kampman Oliver Keene",
    "address": "409 Ellis St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Kane, Shannon & Weiler",
    "address": "107 - 2692 Clearbrook Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Kane, Shannon & Weiler (Newton Office)",
    "address": "220 - 7565 132nd St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Kane, Shannon & Weiler (White Rock Office)",
    "address": "102 - 2055 152nd St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Kearns & Company",
    "address": "1101 - 13737 96th Avenue"
  },
  {
    "category": "Commercial",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Kevin Cherkowski",
    "address": "201, 2928 - 29 St."
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Kidston & Company",
    "address": "200 - 3005 30th St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Kimmitt & Company",
    "address": "202 - 1433 St Paul St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Kinsey Walji Notaries",
    "address": "310-4445 Lougheed Hwy"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Kravetz & Co. Notaries Public In Trust",
    "address": "5501 Salt Lane"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Lake City Law Corporation",
    "address": "205-2901 32nd Street"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Landmark Law Group",
    "address": "501-1367 West Broadway"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Laughlin & Company  Law Corporation",
    "address": "2850 Shaughnessy St Unit 2300"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Lebeau Law Corporation",
    "address": "1118 Austin Ave Unit 201"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Letourneau Notary Corporation",
    "address": "201 - 271 Ross St NE"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Lilian Cazacu Notary Corporation",
    "address": "20385 64th Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Lindsay Kenney LLP Trust Account",
    "address": "8621 201 St Unit 400"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Linley Wellwood LLP",
    "address": "305 - 2692 Clearbrook Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "LMN Law Group",
    "address": "260-500 6th Street"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Lukasz Muc, Notary Public",
    "address": "#105 6758 188th St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "M.A. Mustonen-Hinds, Notary Public",
    "address": "422 - 255 Newport Drive"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "MacCallum Law Group",
    "address": "6345 197th St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "MacDonald Boyle & Jeffery Trust Accoun",
    "address": "20426 Douglas Cres"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "MacDonald Meechan Notaries",
    "address": "12099 Harris Rd Unit 304"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "MacDonald Spicer, Mediator & Notaries Public",
    "address": "Unit B - 32757 Logan Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "MacMillan Tucker & Mackay",
    "address": "5690 176A St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Magellan Law Corporation In Trust",
    "address": "Unit 225 20316 56th Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Magellan Real Estate Law Corp DBA Magellan Real Estate Lawyers in Trust",
    "address": "Unit 228 20316 56th Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Manpriya Sarang Notary Corporation",
    "address": "8028 128 St Unit 114"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Marc Whittemore Law Corporation",
    "address": "830 Bernard Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Marine Landing Notary Public In Trust",
    "address": "509 SW Marine Drive"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Martin Russell Law",
    "address": "503 - 3320 Richter St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Mathew Dober Law Corporation",
    "address": "101-1593 Ellis Street"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "McDonald And Company Trust",
    "address": "631 Carnarvon St Ground Flr"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Mceachern Harris & Watkins Trust Account",
    "address": "22334 Mcintosh Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "McLeod & Schneiderat",
    "address": "474 Main Street"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "McQuarrie Hunter",
    "address": "1500 - 13450 102nd Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Metro Law Office",
    "address": "1141-4700 Kingsway"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Michelle Broughton Notary Public Inc Trust Account",
    "address": "22305 Lougheed Hwy"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Mindy A Jong",
    "address": "1681 West 7th Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "MLC Lawyers Law Corporation In Trust",
    "address": "15245 18th Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Molly Xia Notary Corporation In Trust",
    "address": "1024 Ridgeway Ave Unit 206"
  },
  {
    "category": "Leasehold",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Montgomery Miles Law Firm",
    "address": "410-1708 Dolphin Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Montgomery Miles Law Firm",
    "address": "410 - 1708 Dolphin Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Morgan Crossing Notaries",
    "address": "175-16050 24th Avenue"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Mott Welsh & Associates",
    "address": "203 - 383 Ellis St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Munroe & Company",
    "address": "2850 Shaughnessy St Unit 2207"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Natalya Hanna Notary Corporation In Trust",
    "address": "2849 North Rd Unit 104"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Nazirah Premji Notary Public TRUST ACCOUNT",
    "address": "604 Columbia St Suite 416"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Nev Virk Notary Corp",
    "address": "14980 104 Ave Unit 200"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "New West Notary Public",
    "address": "448 Sixth St"
  },
  {
    "category": "Commercial",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Nixon Wenger",
    "address": "301 - 2706 30th Ave"
  },
  {
    "category": "Leasehold",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Nixon Wenger",
    "address": "301 - 2706 30th Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Nixon Wenger",
    "address": "301-2706 30th Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Okanagan Notaries",
    "address": "#101 -379 Martin Street"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Owen Bird Law Corporation In Trust",
    "address": "595 Burrard St Unit 2900"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Patten Thornton",
    "address": "9245 Main St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Pazder Law Corporation In Trust",
    "address": "800 West Pender St Suite 1460"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Peak Law Group LLP In Trust",
    "address": "19237 122A Ave Unit 209A"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Pearce Schneiderat",
    "address": "474 Main St"
  },
  {
    "category": "Commercial",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Peterson Stark Scott",
    "address": "300 - 10366 136A St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Peterson Stark Scott",
    "address": "300 - 10366 136A St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Pihl & Company - In Trust",
    "address": "5481 Kingsway Unit 205"
  },
  {
    "category": "Leasehold - First Nations",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Porrelli Law",
    "address": "221 3011 Louie Dr"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Porrelli Law",
    "address": "221 3011 Louie Dr"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Porter Ramsay",
    "address": "5000-505 Doyle Ave"
  },
  {
    "category": "Commercial",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Pushor Mitchell LLP",
    "address": "301-1665 Ellis St"
  },
  {
    "category": "Leasehold",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Pushor Mitchell LLP",
    "address": "1665 Ellis St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Pushor Mitchell LLP",
    "address": "1665 Ellis St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Rai & Company Barrister & Solicitor",
    "address": "9200 120 St Unit 201"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Raj Bajaj Notary Corporation",
    "address": "#4- 2599 Cedar Park Place"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Rajeev Kapur Notary Public",
    "address": "6241 Fraser Street"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Rajvir Sidhu Notary Corporation",
    "address": "#204-15955 Fraser Hwy"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "RAZIYA SATTAR IN TRUST Barrister & Solicitor",
    "address": "8254 132A St"
  },
  {
    "category": "Commercial",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "RDM Lawyers LLP",
    "address": "33695 South Fraser Way"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Rhoda L Chapman, Notary Public",
    "address": "108 - 3003 30th St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "RJD Law Corporation",
    "address": "12830 80 Ave Unit 113"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Robertson Downe & Mullally",
    "address": "33695 South Fraser Way"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Rosberg Sawatzky LLP In Trust",
    "address": "20353 64 Ave Unit 201"
  },
  {
    "category": "Leasehold",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Rosborough & Company",
    "address": "201 - 33832 South Fraser Way"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Rosborough & Company",
    "address": "201 - 33832 South Fraser Way"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Sabey Rule LLP",
    "address": "201 - 401 Glenmore Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Sablok and Sablok, Notaries Public",
    "address": "6108 Fraser Street,"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Sahib Sidhu Notary Corporation",
    "address": "32090 South Fraser Way"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Saira Khan Notary Corporation",
    "address": "20486 64 Ave Unit 107"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Schwarz & Co. Law Corporation Trust Account",
    "address": "2922 Glen Dr Unit 206"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Senad Sijercic, Notary Public",
    "address": "22 - 3300 Smith Dr"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Shaun C Langin Law Corporation",
    "address": "100 - 1461 St Paul St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Siebenga & King (Cloverdale Office)",
    "address": "6139 176th St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Siebenga & King (Surrey Office)",
    "address": "288 - 12899 76 Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Siebenga & King Law Offices",
    "address": "33140 Mill Lake Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Siebenga & King Law Offices",
    "address": "7105 Vedder Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Simer Notary Corporation (Trust)",
    "address": "6456 176th St Unit 500-B"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Simpson Notaries",
    "address": "310-2539 Montrose Avenue"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Simpson Notaries",
    "address": "201-7408 Vedder Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Sodagar & Company Law Corporation In Trust",
    "address": "475 West Georgia St Suite 650"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Spagnuolo & Company Real Estate Lawyers",
    "address": "260 - 2300 Carrington Rd"
  },
  {
    "category": "Leasehold",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Spagnuolo & Company Real Estate Lawyers",
    "address": "refer to website for locations"
  },
  {
    "category": "Leasehold",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Spagnuolo & Company Real Estate Lawyers",
    "address": "refer to website for locations"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Spagnuolo & Company Real Estate Lawyers (Abbotsford Office)",
    "address": "260 - 2655 Clearbrook Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Spagnuolo & Company Real Estate Lawyers (Coquitlam Office)",
    "address": "300 - 906 Roderick Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Spagnuolo & Company Real Estate Lawyers (Langley Office)",
    "address": "206 - 20641 Logan Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Spagnuolo & Company Real Estate Lawyers (Maple Ridge Office)",
    "address": "11933 224 St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Spagnuolo & Company Real Estate Lawyers (Surrey Office)",
    "address": "200 - 10193 152A St"
  },
  {
    "category": "Leaseholds & Co-Operatives",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Stewart, Aulinger & Company",
    "address": "1200 - 805 West Broadway"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Sweeny Sarao Notary Corporation",
    "address": "8148 128 St Unit 400"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Tarja K. McLean Notary Public",
    "address": "423 Cedar Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Taylor Miller Law Corporation (Penticton)",
    "address": "345 Wade Avenue E."
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Taylor Miller Law Firm Kelowna Office",
    "address": "1B-2525 Dobbin RD"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Taylor, Tait, Ruley & Company",
    "address": "33066 1st Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Terry Sidhu, Notary Public",
    "address": "33456 South Fraser Way"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "The Notary Group - Kelowna",
    "address": "106 - 347 Leon Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "The Notary Group (Penticton)",
    "address": "130 - 300 Riverside Dr"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Thomas Butler LLP",
    "address": "700 - 1708 Dolphin Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Three Rivers Law Corporation In Trust",
    "address": "2227 McAllister Ave Unit 103"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Tom R.I. Dusevic Law Corporation Dusevic & Co - In Trust",
    "address": "210 4603 Kingsway"
  },
  {
    "category": "Leasehold",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Touchstone Law Group LLP",
    "address": "#208-1664 Rochter St"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Touchstone Law Group LLP",
    "address": "#208-1664 Rochter St"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Valley Law Group",
    "address": "301 - 2031 McCallum Rd"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "W.G. Anderson-Notary Public In Trust",
    "address": "4820 Kingsway Suite 252"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Waal & Co, Notary Public (Agassiz Office)",
    "address": "3 - 1824 #9 Hwy"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Waal & Co, Notary Public (Chilliwack Office)",
    "address": "9086 Young St"
  },
  {
    "category": "Leasehold - First Nations",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Waterstone Law Group",
    "address": "201 - 45793 Luckakuck Way"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Waterstone Law Group",
    "address": "201 - 45793 Luckakuck Way"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Waterstone Law Group",
    "address": "304 - 20338 65th Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Waterstone Law Group LLP (Abbotsford Office)",
    "address": "202-32625 South Fraser Way"
  },
  {
    "category": "Commercial",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Waterstone Law Group LLP (Abbotsford Office)",
    "address": "202-32625 South Fraser Way"
  },
  {
    "category": "Commercial",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Waterstone Law Group LLP (Chilliwack Office)",
    "address": "201 - 45793 Luckakuck Way"
  },
  {
    "category": "Commercial",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Waterstone Law Group LLP (Langley Office)",
    "address": "304-20338 65 Ave"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "West Coast Notaries",
    "address": "7270 Market Crossing Way Unit 210"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "West Coast Notaries",
    "address": "6641 Victoria Drive"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "West Coast Notaries",
    "address": "#410-552 Clarke Road"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Westminster Centre Notaries in Trust",
    "address": "555 Sixth St Unit 340"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "William Cadman Law Corp Trust Acct TRUST ACCOUNT",
    "address": "2922 Glen Dr Suite 205"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Lawyer",
    "name": "Wilson Rasmussen LLP",
    "address": "300 - 15127 100th Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Woolley & Company",
    "address": "3501 27th Street"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Wyper Law",
    "address": "102 Woodlands Place"
  },
  {
    "category": "Retail",
    "region": "Lower Mainland",
    "type": "Notary",
    "name": "Zancope Notary Public",
    "address": "8661 201 St Unit 200"
  },
  {
    "category": "Commercial",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Zaseybida & Bonga",
    "address": "101 - 100 Nanaimo Ave East"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Lawyer",
    "name": "Zaseybida & Bonga",
    "address": "101 - 100 East Nanaimo Ave"
  },
  {
    "category": "Retail",
    "region": "Okanagan",
    "type": "Notary",
    "name": "Zoe Stevens, Notary Public",
    "address": "3 - 120 Harbourfront Drive, NE"
  }
];

export const CMLS_APPROVED_APPRAISERS: DirectoryAppraiserItem[] = [
  {
    "firm": "A.R.C. Appraisal LTD - Lethbridge",
    "address": "614 17 St SW",
    "city": "Medicine Hat",
    "province": "AB",
    "phone": "403-388-4582"
  },
  {
    "firm": "Abbott-Brown Appraisals",
    "address": "10114 89 Street",
    "city": "Grande Prairie",
    "province": "AB",
    "phone": "780-402-1417"
  },
  {
    "firm": "Accord Appraisal Company",
    "address": "4825 51 St",
    "city": "Camrose",
    "province": "AB",
    "phone": "(780) 679-0303"
  },
  {
    "firm": "Accumark Appraisals Ltd",
    "address": "Suite 748, 104-743 Railway Avenue",
    "city": "Canmore",
    "province": "AB",
    "phone": "O 403-678-1748, C 403-679-1733"
  },
  {
    "firm": "Accupro Real Estate Appraisal & Consulting",
    "address": "10032-103 Avenue",
    "city": "Grande Prairie",
    "province": "AB",
    "phone": "780-538-9776"
  },
  {
    "firm": "Achieve Affluence Appraisals",
    "address": "",
    "city": "Edmonton",
    "province": "AB",
    "phone": "780-902-8570"
  },
  {
    "firm": "Advantage Valuation Group Inc.",
    "address": "2204 - 7 Street NE",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-830-6501"
  },
  {
    "firm": "All Property Appraisals Ltd",
    "address": "31 Carr Crescent S.E.",
    "city": "Medicine Hat",
    "province": "AB",
    "phone": "403-527-7199"
  },
  {
    "firm": "Apex Appraisal Service (Apex Consulting Group Ltd)",
    "address": "Box 2354",
    "city": "Banff",
    "province": "AB",
    "phone": "403-762-2072  OR C403-762-0926"
  },
  {
    "firm": "Appraisal Solutions Inc",
    "address": "15 Broadway North",
    "city": "Raymond",
    "province": "AB",
    "phone": "403 394-0004"
  },
  {
    "firm": "Atkinson & Associates",
    "address": "#201 - 20 Sunpark Plaza SE",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-212-1103"
  },
  {
    "firm": "Atlas Appraisal Services",
    "address": "5014 - 50 Avenue",
    "city": "Lloydminster",
    "province": "AB",
    "phone": "780-874-0404"
  },
  {
    "firm": "Avison Young Valuation (aka AVSN Appraisal Group)",
    "address": "802, 1039 17th Ave. SW",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-228-4001"
  },
  {
    "firm": "Balance Valuations Ltd.",
    "address": "#101, 9840 97 Avebye",
    "city": "Grande Prairie",
    "province": "AB",
    "phone": "(780) 296-2323  OR  (780) 532-9788"
  },
  {
    "firm": "Bedrock Appraisals",
    "address": "Greentree Mall",
    "city": "Drumheller",
    "province": "AB",
    "phone": "403-823-0671"
  },
  {
    "firm": "Benchmark Real Estate Appraisals Ltd.",
    "address": "#239 612 500 Country Hills Blvd NE",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-547-6434"
  },
  {
    "firm": "Bettenson Appraisals",
    "address": "7002 85th Street",
    "city": "Grande Prairie",
    "province": "AB",
    "phone": "780-505-1920"
  },
  {
    "firm": "Biegel & Perra Appraisals",
    "address": "102-9715 105 St",
    "city": "Grande Prairie",
    "province": "AB",
    "phone": "780-814-6123"
  },
  {
    "firm": "Black Valuation Group Ltd.",
    "address": "PO Box 70068 Creekside, 150 Edwards Way NW #104",
    "city": "Airdrie",
    "province": "AB",
    "phone": "403-945-1652  OR  587-999-6719"
  },
  {
    "firm": "BNN Appraisals",
    "address": "315 Shawinigan Place SW",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-703-4002"
  },
  {
    "firm": "Calgary Independent Appraisals",
    "address": "263160 Butte Hills Way",
    "city": "Rocky View County",
    "province": "AB",
    "phone": "403-543-5900  OR  403-831-8000"
  },
  {
    "firm": "CAMA Real Estate Appraisals Ltd",
    "address": "4711 - 50 Avenue",
    "city": "Wetaskiwin",
    "province": "AB",
    "phone": "780-335-0042"
  },
  {
    "firm": "Capital Region Real Estate Consulting Ltd.",
    "address": "Box 53076 RPO Glenora",
    "city": "Edmonton",
    "province": "AB",
    "phone": "780-920-2170"
  },
  {
    "firm": "Cartwright Appraisals",
    "address": "#232, 4144A -97 Street",
    "city": "Edmonton",
    "province": "AB",
    "phone": "780-439-9650"
  },
  {
    "firm": "CDC Consulting Services Inc. - AB",
    "address": "111 - 85 Cranford Way",
    "city": "Sherwood Park",
    "province": "AB",
    "phone": "1-800-479-7922 x 101"
  },
  {
    "firm": "Chalifour Denis & Associates",
    "address": "3-412 Thickwood Boulevard",
    "city": "Fort McMurray",
    "province": "AB",
    "phone": "780-743-1331"
  },
  {
    "firm": "City Appraisals",
    "address": "239 Perry Crescent",
    "city": "Medicine Hat",
    "province": "AB",
    "phone": "403-529-6200"
  },
  {
    "firm": "Cornerstone Appraisals Inc.",
    "address": "94 Cougar Ridge Cres SW",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-313-8502"
  },
  {
    "firm": "Darmac Appraisals Ltd",
    "address": "5102 - 49th Street",
    "city": "Lloydminister",
    "province": "AB",
    "phone": "780-875-1917"
  },
  {
    "firm": "DCR Appraisal",
    "address": "312, 204 17 street east",
    "city": "Brooks",
    "province": "AB",
    "phone": "403-427 0804"
  },
  {
    "firm": "Eagleson, Ho & Associates",
    "address": "PO BOX 83006, 15-11625 Elbow Drive SW",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-256-2222   OR 403-650-2223"
  },
  {
    "firm": "Elite Appraisals",
    "address": "7715 Bowcliffe Cres. NW",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-714-1857"
  },
  {
    "firm": "EM Johnson Appraisals",
    "address": "Box 17 Site 130 RR4",
    "city": "Rocky Mountain House",
    "province": "AB",
    "phone": "403 845-2763"
  },
  {
    "firm": "Ergil Bains & Associates Ltd.",
    "address": "Suite 315 11150 Jasper Avenue",
    "city": "Edmonton",
    "province": "AB",
    "phone": "780-442-6636  OR  780-993-3094"
  },
  {
    "firm": "Fletcher's Appraisal Services",
    "address": "#3, 6604 - 82nd Avenue",
    "city": "Edmonton",
    "province": "AB",
    "phone": "780-266-0070 cell"
  },
  {
    "firm": "Frost Valuations Inc (AKA Frost & Associates Realty Services Inc)",
    "address": "#150, 17510 107 Avenue",
    "city": "Edmonton",
    "province": "AB",
    "phone": "780-462-1782"
  },
  {
    "firm": "Great West Appraisals Inc.",
    "address": "138 Hubman Landing",
    "city": "Canmore",
    "province": "AB",
    "phone": "888-771-4571"
  },
  {
    "firm": "Halvorsen Fedynak & Company",
    "address": "201, 6650 178 Street",
    "city": "Edmonton",
    "province": "AB",
    "phone": "780-483-5250"
  },
  {
    "firm": "HarrisonBowker Real Estate Appraisers Ltd.",
    "address": "200, 37 St. Thomas Street",
    "city": "St. Albert",
    "province": "AB",
    "phone": "780-458-3814"
  },
  {
    "firm": "Jackson Real Estate Appraisals Ltd.",
    "address": "Suite 2020, Tower 1 Soctia Place 10060 Jasper Ave",
    "city": "Edmonton",
    "province": "AB",
    "phone": "7804865158"
  },
  {
    "firm": "Kate Rung & Associates",
    "address": "4826 - 50 Street",
    "city": "Olds",
    "province": "AB",
    "phone": "403-556-8758"
  },
  {
    "firm": "Kennedy Appraisals 2016 Inc",
    "address": "48 Carriere Cres",
    "city": "Beaumont",
    "province": "AB",
    "phone": "780-903-7809"
  },
  {
    "firm": "Kerrigan Appraisals Ltd",
    "address": "619 - 8600 Franklin Ave",
    "city": "Fort McMurray",
    "province": "AB",
    "phone": "780-743-8670  OR 780-715-8395"
  },
  {
    "firm": "Knight & Company Appraisals",
    "address": "202 - 10441 - 178 Street, PO Box 69133",
    "city": "Edmonton",
    "province": "AB",
    "phone": "780-486-9545  OR  780-914-6546"
  },
  {
    "firm": "Landucation Consulting Ltd",
    "address": "243 Lakeshore Drive",
    "city": "Island Lake",
    "province": "AB",
    "phone": "780 675-5559"
  },
  {
    "firm": "Lawrenson Walker Appraisers",
    "address": "1092 Cranbrook Grdns SE",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-616-2385"
  },
  {
    "firm": "Lawrenson Walker Appraisers - Alberta",
    "address": "",
    "city": "Lethbridge",
    "province": "AB",
    "phone": "587-291-9661, 780-699-7559, 403-701-5663, OR 403-616-2385"
  },
  {
    "firm": "Lethbridge Property Appraisal Inc.",
    "address": "406-740 4TH Ave S",
    "city": "Lethbridge",
    "province": "AB",
    "phone": "403-329-9000"
  },
  {
    "firm": "M.I.T. Appraisals Ltd.",
    "address": "5503-52 Street",
    "city": "Lloydminster",
    "province": "AB",
    "phone": "780-875-3500"
  },
  {
    "firm": "Mackie Valuations Inc. (Previously Waters Mackie Valuations)",
    "address": "12 Lyle Close",
    "city": "Sylvan Lake",
    "province": "AB",
    "phone": "403-887-8743"
  },
  {
    "firm": "McCartney-Radench Appraisals Inc.",
    "address": "5018 - 3th Avenue, Box 7646,",
    "city": "Edson",
    "province": "AB",
    "phone": "780-723-7471"
  },
  {
    "firm": "New Market Appraisals Ltd.",
    "address": "128 Parkridge Place SE",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-201-1653"
  },
  {
    "firm": "Noble Appraisals",
    "address": "Box 12134",
    "city": "Lloydminster",
    "province": "AB",
    "phone": "780-870-8800"
  },
  {
    "firm": "Northern Lights Real Estate Consulting Ltd.",
    "address": "6417-112 Ave",
    "city": "Edmonton",
    "province": "AB",
    "phone": "780-757-2060"
  },
  {
    "firm": "Paramount Appraisals",
    "address": "30 Ladwig CLose",
    "city": "Red Deer",
    "province": "AB",
    "phone": "403-350-9865"
  },
  {
    "firm": "Perry Appraisal Associates Ltd.",
    "address": "4801-49 Ave",
    "city": "Olds",
    "province": "AB",
    "phone": "403-556-7277"
  },
  {
    "firm": "Plant & Associates Appraisal Services Inc.",
    "address": "9924 108 Ave",
    "city": "Grande Prairie",
    "province": "AB",
    "phone": "780-539-0037  OR   780-539-0037"
  },
  {
    "firm": "PVG Real Estate Valutaions & Consulting",
    "address": "204, 10009-101 Avenue",
    "city": "Grande Prairie",
    "province": "AB",
    "phone": "780-532-1200"
  },
  {
    "firm": "Quinn & Company Appraisals Ltd",
    "address": "P.O. Box 76",
    "city": "Fort McMurray",
    "province": "AB",
    "phone": "780-370-4488"
  },
  {
    "firm": "Raaziq Appraisals Ltd",
    "address": "6383 Ranchview Driver NW",
    "city": "Calgary",
    "province": "AB",
    "phone": "587-894-2658"
  },
  {
    "firm": "Red Deer Appraisals Ltd.",
    "address": "142 Connaught Cres",
    "city": "Red Deer",
    "province": "AB",
    "phone": "403-350-8438"
  },
  {
    "firm": "S.D. Taylor & Company",
    "address": "472 Douglasbank Crt SE",
    "city": "Calgary",
    "province": "AB",
    "phone": "403 519 9363"
  },
  {
    "firm": "Sage Appraisals",
    "address": "RPO North Hill Box 65117",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-282-3322"
  },
  {
    "firm": "Soderquist Appraisals",
    "address": "200, 542 Laura Ave",
    "city": "Red Deer",
    "province": "AB",
    "phone": "403-346-5533"
  },
  {
    "firm": "Squair Appraisals & Consulting",
    "address": "Box 154",
    "city": "Clyde",
    "province": "AB",
    "phone": "780-995-6354"
  },
  {
    "firm": "Steckler Real Estate Appraisals",
    "address": "39 Falcon Crescent",
    "city": "Sylvan Lake",
    "province": "AB",
    "phone": "403-392-2547"
  },
  {
    "firm": "Stettler Appraisals",
    "address": "4703 49 St, Box 1101",
    "city": "Stettler",
    "province": "AB",
    "phone": "587-282-0822"
  },
  {
    "firm": "Stone Appraisals",
    "address": "P.O. Box 1155",
    "city": "Manning",
    "province": "AB",
    "phone": "780-618-8408  OR 780-836-0695"
  },
  {
    "firm": "SwanCo Appraisals",
    "address": "",
    "city": "Spruce Grove",
    "province": "AB",
    "phone": "780-554-1361"
  },
  {
    "firm": "Tru Appraisals Ltd.",
    "address": "2530-12th Ave SE",
    "city": "Medicine Hat",
    "province": "AB",
    "phone": "403-580-8215  OR  403-633-0405"
  },
  {
    "firm": "TruePoint Appraisals",
    "address": "106 - 172 Clearview Dr",
    "city": "Red Deer",
    "province": "AB",
    "phone": "403-341-0011"
  },
  {
    "firm": "Ultra Precise Appraisals Inc",
    "address": "",
    "city": "Lethbridge",
    "province": "AB",
    "phone": "403-795-0998"
  },
  {
    "firm": "Val Appraisals",
    "address": "5012 51 Ave",
    "city": "Bonnyville",
    "province": "AB",
    "phone": "780-826-2719"
  },
  {
    "firm": "Wainwright Assessment Group",
    "address": "602 - 10th Street",
    "city": "Wainwright",
    "province": "AB",
    "phone": "780-842-5002"
  },
  {
    "firm": "Weidman Reliance Group Inc",
    "address": "130, 15 Royal Vista Way NW",
    "city": "Calgary",
    "province": "AB",
    "phone": "403-241-2535"
  },
  {
    "firm": "Wildrose Appraisals",
    "address": "Box 1077",
    "city": "Sundre",
    "province": "AB",
    "phone": "403-559-8200"
  },
  {
    "firm": "Adlaw Appraisals Ltd.",
    "address": "3849 Clark Dr",
    "city": "Vancouver",
    "province": "BC",
    "phone": "604-809-8506"
  },
  {
    "firm": "Aedis Appraisals",
    "address": "#200-1687 West Broadway",
    "city": "Vancouver",
    "province": "BC",
    "phone": "604-682-7585  OR  604-657-1111"
  },
  {
    "firm": "All Equity Appraisals Ltd",
    "address": "1635 Gillard Drive",
    "city": "Kelowna",
    "province": "BC",
    "phone": "250-717-7509"
  },
  {
    "firm": "Alpha Appraisals",
    "address": "",
    "city": "Kelowna",
    "province": "BC",
    "phone": "250-682-1430"
  },
  {
    "firm": "Angelica Real Estate Advisory Services",
    "address": "Box 3253",
    "city": "Garibaldi Highlands",
    "province": "BC",
    "phone": "604-290-4875"
  },
  {
    "firm": "Appraisal West Real Estate Corp",
    "address": "Box 30001, RPO Glenpark",
    "city": "Kelowna",
    "province": "BC",
    "phone": "250-861-3101  OR  250-862-2299"
  },
  {
    "firm": "Appraisals North West (AKA GHW Appraisals Northwest)",
    "address": "204 - 4650 Lazelle Ave",
    "city": "Terrace",
    "province": "BC",
    "phone": "250-635-0615"
  },
  {
    "firm": "Associated Appraisers",
    "address": "7124 Headquarters Road",
    "city": "Courtenay",
    "province": "BC",
    "phone": "250-202-0163     OR     250-897-8771"
  },
  {
    "firm": "Associated Appraisers - Campbell River",
    "address": "Station A, Box 115",
    "city": "Campbell River",
    "province": "BC",
    "phone": "250-202-0163"
  },
  {
    "firm": "Astro Appraisals",
    "address": "331 St. Julian St",
    "city": "Duncan",
    "province": "BC",
    "phone": "250-748-3159   OR  250-710-2325"
  },
  {
    "firm": "A-Teck Appraisals Ltd",
    "address": "3255 Upper Fraser Rd",
    "city": "Prince George",
    "province": "BC",
    "phone": "250-649-1111"
  },
  {
    "firm": "Baker & Osland Appraisal Ltd.",
    "address": "180 Cook Street",
    "city": "Victoria",
    "province": "BC",
    "phone": "250-475-2221   or   250-812-9369"
  },
  {
    "firm": "Bakerview Realty Appraisals Inc",
    "address": "15577 37A Avenue",
    "city": "Surrey",
    "province": "BC",
    "phone": "604-819-6966  OR  604-542-9222"
  },
  {
    "firm": "Bayline Real Estate Ltd.",
    "address": "268 Magic Dr",
    "city": "Kelowna",
    "province": "BC",
    "phone": "250-868-2532"
  },
  {
    "firm": "C.H. Godfrey Appraisals Ltd.",
    "address": "1524 Fir Street",
    "city": "Prince George",
    "province": "BC",
    "phone": "250-563-1208  OR 205-552-8807"
  },
  {
    "firm": "Campbell & Pound LTD.",
    "address": "1111-11872 Horseshow Way",
    "city": "Richmond",
    "province": "BC",
    "phone": "604-270-8885  OR  604-315-6333"
  },
  {
    "firm": "CDC Consulting Services Inc. - BC",
    "address": "1090 Homer St, Suite 300",
    "city": "Vancouver",
    "province": "BC",
    "phone": "1-866-479-7922"
  },
  {
    "firm": "Coast Appraisals",
    "address": "101, 2220 Sooke Road",
    "city": "Victoria",
    "province": "BC",
    "phone": "250-388-9151"
  },
  {
    "firm": "Coast Wide Appraisals",
    "address": "PO Box 1367 (#2, 926 Gibsons Way)",
    "city": "Gibsons",
    "province": "BC",
    "phone": "604-886-9831"
  },
  {
    "firm": "Conviare Real Estate Appraisers",
    "address": "#600-1200 West 73rd Ave",
    "city": "Vancouver",
    "province": "BC",
    "phone": "604-670-1007"
  },
  {
    "firm": "Corrie Appraisals",
    "address": "Box 822",
    "city": "Salmon Arm",
    "province": "BC",
    "phone": "778-489-4663"
  },
  {
    "firm": "Creston Valley Appraisals",
    "address": "Box 425",
    "city": "Creston",
    "province": "BC",
    "phone": "250-428-3503 OR  250-428-6633"
  },
  {
    "firm": "Cunningham & Rivard Appraisals",
    "address": "300-394 Duncan Street",
    "city": "Duncan",
    "province": "BC",
    "phone": "250-753-3428"
  },
  {
    "firm": "Cunningham & Rivard Appraisals, Campbell River",
    "address": "105 - 300 St. Ann's Road",
    "city": "Campbell River",
    "province": "BC",
    "phone": "250-287-9595"
  },
  {
    "firm": "D Fritz Appraisals",
    "address": "840 Royal Oak Ave",
    "city": "Victoria",
    "province": "BC",
    "phone": "250-413-7319  OR  250-516-7319"
  },
  {
    "firm": "Dedora Schoenne & Associates",
    "address": "3215 31 Ave",
    "city": "Vernon",
    "province": "BC",
    "phone": "(250) 542-2222"
  },
  {
    "firm": "Elliott Appraisals",
    "address": "104-1015 Columbia St",
    "city": "New Westminster",
    "province": "BC",
    "phone": "604-313-7598"
  },
  {
    "firm": "Farnsworth Appraisals Ltd.",
    "address": "631 Laurier Drive",
    "city": "Kamloops",
    "province": "BC",
    "phone": "250-377-3995"
  },
  {
    "firm": "Fast Appraisals",
    "address": "5078 Bentley Drive",
    "city": "Delta",
    "province": "BC",
    "phone": "604-351-8916"
  },
  {
    "firm": "Fernie Appraisals Ltd.",
    "address": "PO Box 747",
    "city": "Fernie",
    "province": "BC",
    "phone": "250-423-1039  OR  250-423-4304"
  },
  {
    "firm": "Finden Appraisals Ltd.",
    "address": "PO Box 21121,  385 Winnipeg St.",
    "city": "Prince George",
    "province": "BC",
    "phone": "250-960-1133"
  },
  {
    "firm": "Flynn Mirtle Moran Appraisers",
    "address": "207 - 310 Nicola Street",
    "city": "Kamloops",
    "province": "BC",
    "phone": "250-374-7731"
  },
  {
    "firm": "Fraser Valley Appraisals",
    "address": "22-8337 Young Road",
    "city": "Chilliwack",
    "province": "BC",
    "phone": "604-792-2133"
  },
  {
    "firm": "Fraserway Appraisal Ltd.",
    "address": "452 33771 George Ferguson",
    "city": "Abobotsford",
    "province": "BC",
    "phone": "604-850-5557   OR  604-217-0439"
  },
  {
    "firm": "G. W. Marken Appraisal",
    "address": "1529 Grandview Drive",
    "city": "Castlegar",
    "province": "BC",
    "phone": "250-365-9485  OR  250-304-4558"
  },
  {
    "firm": "Gobin Appraisals",
    "address": "PO Box 38100, 968 West King Edward Ave",
    "city": "Vancouver",
    "province": "BC",
    "phone": "604-722-0100"
  },
  {
    "firm": "Golden Ears Appraisals 2002 Ltd.",
    "address": "20530 Powell Avenue",
    "city": "Maple Ridge",
    "province": "BC",
    "phone": "604-460-0883"
  },
  {
    "firm": "Great West Appraisals Inc. (AKA, Kicking Horse Appraisals)",
    "address": "PO Box 328",
    "city": "Invermere",
    "province": "BC",
    "phone": "888-771-4571"
  },
  {
    "firm": "Hennigar & Associates Consulting",
    "address": "20070 Grade Crescent",
    "city": "Langley",
    "province": "BC",
    "phone": "604-897-9518"
  },
  {
    "firm": "Highland Appraisals Inc",
    "address": "8239 171 ST",
    "city": "Surrey",
    "province": "BC",
    "phone": "604-562-4704"
  },
  {
    "firm": "IKD Appraisal Services Lrd.",
    "address": "1641 Brunt Drive",
    "city": "Nanoose Bay",
    "province": "BC",
    "phone": "250-468-9711"
  },
  {
    "firm": "Inland Appraisers Ltd.",
    "address": "208 Main Street",
    "city": "Penticton",
    "province": "BC",
    "phone": "250-493-6734"
  },
  {
    "firm": "Intercity Appraisals",
    "address": "6203 - 2850 Shaughnessy Street",
    "city": "Port Coquitlam",
    "province": "BC",
    "phone": "604-944-3282"
  },
  {
    "firm": "Isle West Appraisals",
    "address": "2603 Cosgrove Cres",
    "city": "Nannaimo",
    "province": "BC",
    "phone": "250-756-1779"
  },
  {
    "firm": "John VanWoerkom",
    "address": "5253 57A Street",
    "city": "Delta",
    "province": "BC",
    "phone": "604-306-3790"
  },
  {
    "firm": "Kohlen & Company",
    "address": "1703 C S Broadway",
    "city": "Williams Lake",
    "province": "BC",
    "phone": "250-302-1074"
  },
  {
    "firm": "Kors & Associates",
    "address": "201-739 Kings Road",
    "city": "Victoria",
    "province": "BC",
    "phone": "250-920-5552"
  },
  {
    "firm": "Kutyn Property Services",
    "address": "1819 Beaufort Avenue # 301",
    "city": "Comox",
    "province": "BC",
    "phone": "250-890-3320"
  },
  {
    "firm": "Landquest Appraisals Ltd.",
    "address": "11219 102 St",
    "city": "Fort St. John",
    "province": "BC",
    "phone": "250-785-5700  OR 250-262-7262"
  },
  {
    "firm": "Lawrenson Walker Real Estate Appraisers Ltd.",
    "address": "200-1678 128 St",
    "city": "Surrey",
    "province": "BC",
    "phone": "587-291-9661,  604-313-7607,  604-307-4999,  604-783-9243"
  },
  {
    "firm": "Leemore & Associates RE Appraisals & Consultants Ltd.",
    "address": "B3 - 1410 Parkway Blvd",
    "city": "Coquitlam",
    "province": "BC",
    "phone": "604-944-7005  OR  604-760-3353"
  },
  {
    "firm": "Linquist Real Estate Appraisal",
    "address": "3266 St. Johns Street",
    "city": "Port Moody",
    "province": "BC",
    "phone": "604-942-7290"
  },
  {
    "firm": "Lower Mainland Appraisal Services",
    "address": "#8 - 3034 Edgemont Blvd",
    "city": "North Vancouver",
    "province": "BC",
    "phone": "604-618-5676"
  },
  {
    "firm": "Macintosh Appraisals LTD",
    "address": "401-555 Sixth Street",
    "city": "New Westminster",
    "province": "BC",
    "phone": "604-522-3900"
  },
  {
    "firm": "Magee Appraisals",
    "address": "#73-658 Alderwood Drive",
    "city": "Ladysmith",
    "province": "BC",
    "phone": "250-924-8892"
  },
  {
    "firm": "McDonald Appraisals Inc.",
    "address": "Box 6576",
    "city": "Fort St John",
    "province": "BC",
    "phone": "250-785-4895"
  },
  {
    "firm": "McIntosh Appraisals & Consulting - Invermere, BC",
    "address": "PO BOX  459  (1022B 7 Ave)",
    "city": "Invermere",
    "province": "BC",
    "phone": "250-342-4444"
  },
  {
    "firm": "Meisterman Appraisals",
    "address": "#270 - 12420 No. 1 Road",
    "city": "Richmond",
    "province": "BC",
    "phone": "604-808-0122  OR  604-277-5223"
  },
  {
    "firm": "Michael Harley & Associates",
    "address": "10959 Eva Road",
    "city": "Lake Country",
    "province": "BC",
    "phone": "250-470-7735"
  },
  {
    "firm": "Mills Appraisal Group Ltd.",
    "address": "310 3450 Uptown Blvd",
    "city": "Victoria",
    "province": "BC",
    "phone": "250-727-0222  OR  250-812-6841"
  },
  {
    "firm": "Nearhood Appraisal Services Ltd.",
    "address": "#201, 9711-100th Avenue",
    "city": "Fort St. John",
    "province": "BC",
    "phone": "250-785-3191"
  },
  {
    "firm": "Nicam Appraisals Inc.",
    "address": "1112 Duncan Ave. E",
    "city": "Penticton",
    "province": "BC",
    "phone": "778-476-5440  OR  250-809-9697"
  },
  {
    "firm": "Niemi La Porte & Dowle - Victoria",
    "address": "100-1803 Douglas St",
    "city": "Victoria",
    "province": "BC",
    "phone": "250-412-3182"
  },
  {
    "firm": "Niemi LaPorte & Dowle Appraisals Ltd.",
    "address": "312 - 8678 Greenall Ave",
    "city": "Burnaby",
    "province": "BC",
    "phone": "800-739-4512 or 604-438-1628"
  },
  {
    "firm": "North Cariboo Appraisals Ltd",
    "address": "458 B Reid Street",
    "city": "Quesnel",
    "province": "BC",
    "phone": "250-992-6386"
  },
  {
    "firm": "North Isle Appraisals",
    "address": "Box 31",
    "city": "Heriot Bay",
    "province": "BC",
    "phone": "250-285-2599"
  },
  {
    "firm": "Okanagan Appraisals Ltd. (AKA Aedis Okanagan Services Inc)",
    "address": "203-1180 Sunset Dr",
    "city": "Kelowna",
    "province": "BC",
    "phone": "250-763-0346"
  },
  {
    "firm": "Okanagan North Appraisal Services 2015",
    "address": "PO Box 291055,  #102, 3131 - 29th Street",
    "city": "Kelowna",
    "province": "BC",
    "phone": "250-763-0346"
  },
  {
    "firm": "Pacific Rim Appraisals Ltd.",
    "address": "#2-57 Skinner Street",
    "city": "Nanaimo",
    "province": "BC",
    "phone": "250-754-3710  OR  866-612-2600"
  },
  {
    "firm": "Pacific West Appraisals",
    "address": "404 2484 Wilson Avenue",
    "city": "Port Coquitlam",
    "province": "BC",
    "phone": "604-328-2862"
  },
  {
    "firm": "Palmer Appraisal Ltd.",
    "address": "2244 Kinross Ave",
    "city": "Victoria",
    "province": "BC",
    "phone": "250-388-9102"
  },
  {
    "firm": "PCAG Property Advisors Inc.",
    "address": "3581 Bishop Cr.",
    "city": "Port Alberni",
    "province": "BC",
    "phone": "250-723-5099"
  },
  {
    "firm": "Penny & Keenleyside Appraisals (AKA Collingwood Appraisals)",
    "address": "Unit 1-10318 Whalley Boulevard",
    "city": "Surrey",
    "province": "BC",
    "phone": "604-525-3441 / 604-345-8477"
  },
  {
    "firm": "Peter Ryks Property Services Ltd",
    "address": "1437 Markay Drive, PO Box 770",
    "city": "Vanderhoof",
    "province": "BC",
    "phone": "250-567-9158"
  },
  {
    "firm": "Ponti Appraisals",
    "address": "184 Robson Dr",
    "city": "Kamloops",
    "province": "BC",
    "phone": "250-828-9906"
  },
  {
    "firm": "Precision Appraisal Group",
    "address": "301 Curtis Road",
    "city": "Comox",
    "province": "BC",
    "phone": "250-897-5046"
  },
  {
    "firm": "Princeton Appraisals",
    "address": "325 K View Crescent",
    "city": "Keremeos",
    "province": "BC",
    "phone": "250-499-2406"
  },
  {
    "firm": "Rivard & Associates",
    "address": "3305 34 Street",
    "city": "Vernon",
    "province": "BC",
    "phone": "250-545-3278"
  },
  {
    "firm": "RMC Appraisals",
    "address": "Box 404",
    "city": "Pouce Coupe",
    "province": "BC",
    "phone": "250-719-1858"
  },
  {
    "firm": "Rocky Mountain Appraisals",
    "address": "25 - 10 Avenue South",
    "city": "Cranbrook",
    "province": "BC",
    "phone": "250-420-2394    OR  250-421-4613"
  },
  {
    "firm": "Royal LePage East Kootenay Realty",
    "address": "25 - 10 Ave S",
    "city": "Cranbrook",
    "province": "BC",
    "phone": "250-420-2350 or 250-426-9482"
  },
  {
    "firm": "Schenoni & Associates Inc.",
    "address": "8149 - 156A Street",
    "city": "Surrey",
    "province": "BC",
    "phone": "604-377-7334"
  },
  {
    "firm": "Schoenne Appraisals",
    "address": "101-144 Front Street",
    "city": "Penticton",
    "province": "BC",
    "phone": "250-492-5151"
  },
  {
    "firm": "South Cariboo Appraisals Ltd",
    "address": "Box 1289",
    "city": "100 Mile House",
    "province": "BC",
    "phone": "250-395-1730"
  },
  {
    "firm": "South Okanagan Appraisals",
    "address": "204 -74 Wade Ave East",
    "city": "Penticton",
    "province": "BC",
    "phone": "250-492-5833"
  },
  {
    "firm": "Steve Cullis Appraisals Ltd.",
    "address": "2-2823 Clark St",
    "city": "Terrace",
    "province": "BC",
    "phone": "250-635-5211"
  },
  {
    "firm": "Strand & Godfrey Appraisals Ltd.",
    "address": "903B 4th Street",
    "city": "Castlegar",
    "province": "BC",
    "phone": "250-365-5161"
  },
  {
    "firm": "Summit Appraisal & Consulting Ltd.",
    "address": "1199 Bay Avenue, Unit 202",
    "city": "Trail",
    "province": "BC",
    "phone": "250-362-9696   OR  250-921-5699"
  },
  {
    "firm": "Surrey Home Appraisals Ltd",
    "address": "Box 218, 102 - 15910 Fraser Hwy",
    "city": "Surrey",
    "province": "BC",
    "phone": "604-786-8668"
  },
  {
    "firm": "TDC Realty Appraisers",
    "address": "#201, 14756 Thrift Avenue",
    "city": "White Rock",
    "province": "BC",
    "phone": "604-970-5215"
  },
  {
    "firm": "Thompson Rivers Appraisals Inc",
    "address": "919 Dominion Street",
    "city": "Kamloops",
    "province": "BC",
    "phone": "250-372-2599"
  },
  {
    "firm": "Urban Valley Appraisals",
    "address": "P.O. Box 333, Stn A",
    "city": "Abbotsford",
    "province": "BC",
    "phone": "1-888-852-8087"
  },
  {
    "firm": "Walton Appraisals Ltd",
    "address": "PO Box 3111",
    "city": "Garibaldi Highlands",
    "province": "BC",
    "phone": "604-892-2311"
  },
  {
    "firm": "Wertz Appraisals",
    "address": "Box 2088",
    "city": "Smithers",
    "province": "BC",
    "phone": "250-847-5303"
  },
  {
    "firm": "Westech Appraisal Services Ltd.",
    "address": "411-197 Forester Street",
    "city": "North Vancouver",
    "province": "BC",
    "phone": "(604) 986-2722"
  },
  {
    "firm": "Westside Appraisals Inc.",
    "address": "8726 Barnard St",
    "city": "Vancouver",
    "province": "BC",
    "phone": "604-264-8004"
  },
  {
    "firm": "Zaikow Agencies (Westview Realty)",
    "address": "4471 Joyce Ave",
    "city": "Powell River",
    "province": "BC",
    "phone": "604-485-7788"
  },
  {
    "firm": "A.L. McCoubrey & Associates (now at BW Ferguson & Associates)",
    "address": "14 Marksbridge Drive /  #3, 1172 Pembina Highway",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-261-9000  OR  204-981-4135"
  },
  {
    "firm": "Acclaimed Appraisal Group",
    "address": "77 Moore Avenue",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-891-0356"
  },
  {
    "firm": "Agassiz Appraisals Inc.",
    "address": "Box 1322",
    "city": "Winkler",
    "province": "MB",
    "phone": "204-362-3877"
  },
  {
    "firm": "AJC Appraisals",
    "address": "22 Alenbrook Bay",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-223-4998"
  },
  {
    "firm": "Booth Cowie Appraisals Services (PREV Booth Cowie Appraisals)",
    "address": "261 Rideau Street",
    "city": "Brandon",
    "province": "MB",
    "phone": "204-717-1946  OR  204-578-5071"
  },
  {
    "firm": "Brad Carefoot",
    "address": "Box 1033",
    "city": "Dauphin",
    "province": "MB",
    "phone": "204-622-2248"
  },
  {
    "firm": "Burley Appraisal Associates",
    "address": "207, 3336 Portage Avenue",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-470-4199"
  },
  {
    "firm": "C.W. Appraisals",
    "address": "1175 Andrechuk Rd",
    "city": "Howden",
    "province": "MB",
    "phone": "204-223-3475"
  },
  {
    "firm": "CDC Inc.",
    "address": "201 Portage Avenue, 18th Floor",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "1-866-479-7922"
  },
  {
    "firm": "CL Appraisals",
    "address": "1 Lakeview Drive",
    "city": "Brandon",
    "province": "MB",
    "phone": "204-724-0814"
  },
  {
    "firm": "Dennis T. Browaty & Assoc",
    "address": "565 - 167 Lombard Ave",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-942-7574"
  },
  {
    "firm": "Grantham Appraisal Service",
    "address": "Box 1387",
    "city": "Stonewall",
    "province": "MB",
    "phone": "204-467-5295"
  },
  {
    "firm": "Halladay Appraisal Services Ltd",
    "address": "Ste 262, 23 - 845 Dakota St",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-981-1390"
  },
  {
    "firm": "Herb Jaques",
    "address": "Box 189",
    "city": "The Pas",
    "province": "MB",
    "phone": "204-623-2374  OR  204-620-1868"
  },
  {
    "firm": "Hink Appraisals",
    "address": "34 Galbraith Cres",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-896-3979"
  },
  {
    "firm": "Jordan Appraisal Group",
    "address": "44 2nd Avenue SE, Box 336",
    "city": "Minnedosa",
    "province": "MB",
    "phone": "204-573-6814"
  },
  {
    "firm": "Kemp Appraisals Ltd.",
    "address": "162-2025 Corydon Ave., Suite 71",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-791-1746"
  },
  {
    "firm": "LS Appraisals & Consulting Services",
    "address": "Box 4, Grp 11A, R R 1",
    "city": "Richer",
    "province": "MB",
    "phone": "204-371-8295"
  },
  {
    "firm": "MacKenzie & Associates",
    "address": "P O Box 21005 RPO Charleswood",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-837-7739"
  },
  {
    "firm": "Red River Appraisals",
    "address": "Box 1180",
    "city": "Niverville",
    "province": "MB",
    "phone": "204-371-5833"
  },
  {
    "firm": "Rempel Wagner Dunn",
    "address": "LL03-301 Nassau St North",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-782-4419  OR 204-982-2895"
  },
  {
    "firm": "Sherrett Appraisals Inc.",
    "address": "PO BOX 61051 RPO GRANT PARK",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-489-9011"
  },
  {
    "firm": "The Appraisal Network",
    "address": "PO Box 38074",
    "city": "East St Paul",
    "province": "MB",
    "phone": "204-995-4350"
  },
  {
    "firm": "Tomchuk & Associates",
    "address": "477 Rivergrove Dr",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-227-0919"
  },
  {
    "firm": "Tomiuk Grycko & Associates",
    "address": "Box  177, #3, 363 Broadway,",
    "city": "Winnipeg",
    "province": "MB",
    "phone": "204-942-2121 OR 204-955-1741"
  },
  {
    "firm": "Absolute Appraisals",
    "address": "19 2nd Avenue",
    "city": "Saint Andre",
    "province": "NB",
    "phone": "506-479-4709  OR 506-473-8032"
  },
  {
    "firm": "AES CONSULTANTS LTD.",
    "address": "572 Rue Principale, Unit 1 (Frederick), P.O. Box 573 - 360 Parkside Drive (Fred)",
    "city": "Petit-Rocher, Bathurst",
    "province": "NB",
    "phone": "506-226-3827, 506-548-3363"
  },
  {
    "firm": "Appraisals (Fundy) Ltd.",
    "address": "29 Duke St",
    "city": "Saint John",
    "province": "NB",
    "phone": "506-634-1274"
  },
  {
    "firm": "De Stecher Appraisals Ltd.",
    "address": "506 - 133 Prince William Street",
    "city": "St John",
    "province": "NB",
    "phone": "506-634-8423"
  },
  {
    "firm": "DG Evaluation",
    "address": "67 Rue Leblond",
    "city": "Edmunston",
    "province": "NB",
    "phone": "506-737-8484"
  },
  {
    "firm": "Evaluation Action Appraisals",
    "address": "24 Madawaska Rd",
    "city": "Grand Falls",
    "province": "NB",
    "phone": "506-473-9111"
  },
  {
    "firm": "Evaluation Perron's Appraisals",
    "address": "14 Central St",
    "city": "Campbellton",
    "province": "NB",
    "phone": "506-789-8854"
  },
  {
    "firm": "Evaluations Anglehart Appraisals",
    "address": "PO Box 291",
    "city": "Campbellton",
    "province": "NB",
    "phone": "506-329-9000"
  },
  {
    "firm": "Evaluations Babineau Appraisals Ltd.",
    "address": "345 St George St, P.O. Box 1273",
    "city": "Moncton",
    "province": "NB",
    "phone": "506-856-8686"
  },
  {
    "firm": "Fredericton Appraisal Associates Ltd.",
    "address": "500 Brookside Dr, Unit E",
    "city": "Fredericton",
    "province": "NB",
    "phone": "506-458-9533"
  },
  {
    "firm": "G.A. Barry Appraisals Ltd.",
    "address": "309 North Napan Road,",
    "city": "Napan",
    "province": "NB",
    "phone": "506-622-1417"
  },
  {
    "firm": "Landing Appraisals Ltd.",
    "address": "PO Box 1033",
    "city": "St.George",
    "province": "NB",
    "phone": "506-662-8415"
  },
  {
    "firm": "Leech Appraisals Ltd. (Atlantic Realty Advisors)",
    "address": "530 Main Street",
    "city": "Woodstock",
    "province": "NB",
    "phone": "506-328-3120  OR  506-324-3456"
  },
  {
    "firm": "Mari-Tech Appraisal & Inspection",
    "address": "124 Halifax Street",
    "city": "Moncton",
    "province": "NB",
    "phone": "506-852-4184"
  },
  {
    "firm": "Perron-Lynch & Associates",
    "address": "14 Central St",
    "city": "Campbellton",
    "province": "NB",
    "phone": "506-789-8854"
  },
  {
    "firm": "Resurgo Appraisals Inc",
    "address": "1360 Champlain\u00a0 Street",
    "city": "Dieppe",
    "province": "NB",
    "phone": "506-384-3957"
  },
  {
    "firm": "Roxwood Appraisals",
    "address": "119 Cedar Ave",
    "city": "Fredericton",
    "province": "NB",
    "phone": "506-457-1660"
  },
  {
    "firm": "AAT Appraisers",
    "address": "3 Ivany's Road",
    "city": "Grand Fall-Windsor",
    "province": "NL",
    "phone": "709-290-4398"
  },
  {
    "firm": "Appraisal Associates (Gander) Ltd.",
    "address": "Box 266, 93 Edinburgh Ave",
    "city": "Gander",
    "province": "NL",
    "phone": "709-651-2491"
  },
  {
    "firm": "Appraisal Associates Limited",
    "address": "157 Pennywell Road",
    "city": "St. John's",
    "province": "NL",
    "phone": "709-726-8757"
  },
  {
    "firm": "Appraisal of Real Property ltd",
    "address": "55 Quidi Vidi Rd",
    "city": "St. John's",
    "province": "NL",
    "phone": "709-576-8290"
  },
  {
    "firm": "ARA - Kirkland, Balsom & Associates",
    "address": "21 Mews Place",
    "city": "St. John's",
    "province": "NL",
    "phone": "709-738-1000  OR 709-682-7205"
  },
  {
    "firm": "Avalon Appraisals Ltd.",
    "address": "Water St., PO Box 531",
    "city": "Harbour. Grace",
    "province": "NL",
    "phone": "709-596-1998"
  },
  {
    "firm": "Bay Roberts Appraisal Services",
    "address": "Box 7",
    "city": "Coley's Point",
    "province": "NL",
    "phone": "709-786-6776"
  },
  {
    "firm": "Brocklehurst & Company Limited",
    "address": "42 Paddy Dobbin Drive",
    "city": "St. John's",
    "province": "NL",
    "phone": "709-753-2620   OR   709-746-4123"
  },
  {
    "firm": "Burton Appraisal",
    "address": "184 Georgetown Road",
    "city": "Corner Brook",
    "province": "NL",
    "phone": "709-634-3017"
  },
  {
    "firm": "DEW Enterprises Ltd.",
    "address": "1A Cartwright Street, Suite 9",
    "city": "Grand Falls-Windsor",
    "province": "NL",
    "phone": "709-486-6895  OR  709-489-6895"
  },
  {
    "firm": "Hamilton Contracting Ltd",
    "address": "PO Box 68, Stn C",
    "city": "Goose Bay",
    "province": "NL",
    "phone": "709-896-0514"
  },
  {
    "firm": "J & T Appraisals Ltd.",
    "address": "3 Sprucewood Lane",
    "city": "Torbay",
    "province": "NL",
    "phone": "709-631-1139"
  },
  {
    "firm": "Kelly Appraisal Services",
    "address": "85 Harmsworth Drive",
    "city": "Grand Falls-Windsor",
    "province": "NL",
    "phone": "(709) 290-4852"
  },
  {
    "firm": "Kirkland Appraisals",
    "address": "34 Harrington Drive",
    "city": "St. John's",
    "province": "NL",
    "phone": "709-687-4840"
  },
  {
    "firm": "MacDonald & Hoffe Appraisals Ltd",
    "address": "17 Mayor Ave",
    "city": "Deer Lake",
    "province": "NL",
    "phone": "709-635-5374"
  },
  {
    "firm": "Pumphrey and Associates Incorporated",
    "address": "11 Perlin Street St.",
    "city": "St. John's",
    "province": "NL",
    "phone": "709-691-6789"
  },
  {
    "firm": "RexNor Enterprise Ltd",
    "address": "13 Dennis Road PO Box 2223",
    "city": "Port aux Basques",
    "province": "NL",
    "phone": "709 695-8656"
  },
  {
    "firm": "RPS Appraisal Consultants Inc",
    "address": "PO Box 727",
    "city": "Springdale / Goose Bay",
    "province": "NL",
    "phone": "709-673-5795"
  },
  {
    "firm": "SRW Appraisals",
    "address": "43 Main St. Box 88",
    "city": "Stephenville",
    "province": "NL",
    "phone": "709-643-2714"
  },
  {
    "firm": "Young's Real Estate Appraisal",
    "address": "36 Humberview Dr",
    "city": "Deer Lake",
    "province": "NL",
    "phone": "709-635-3583"
  },
  {
    "firm": "Abacus Residential Appraisals Inc.",
    "address": "99 Wyse Road,",
    "city": "Dartmouth",
    "province": "NS",
    "phone": "902-449-7215  OR  902-449-7215"
  },
  {
    "firm": "AKME Appraisals",
    "address": "535 Larry Uteck Blvd Suite 35029",
    "city": "Bedford",
    "province": "NS",
    "phone": "902-440-2378"
  },
  {
    "firm": "Alderney R.E. Appraisals",
    "address": "165 Portland Street",
    "city": "Dartmouth",
    "province": "NS",
    "phone": "902-466-2000"
  },
  {
    "firm": "Allison Appraisals Limited",
    "address": "64 Robert Scott Drive",
    "city": "Lantz",
    "province": "NS",
    "phone": "902-497-6149  OR  902-883-7541"
  },
  {
    "firm": "Antovic Real Property Appraisals",
    "address": "61 Flagstone Drive",
    "city": "Cole Harbour",
    "province": "NS",
    "phone": "902-441-4434"
  },
  {
    "firm": "Barkhouse Appraisals",
    "address": "521 Northside River Bourgeois Road",
    "city": "River Bourgeois",
    "province": "NS",
    "phone": "902-870-3850"
  },
  {
    "firm": "Boutilier & Associates",
    "address": "Box 28070 175 Main St, S205",
    "city": "Dartmouth",
    "province": "NS",
    "phone": "902-223-6537 (Peter), 902-292-5788 (Cody), 905-435-2200 (Joseph, Ryan, Jeffrey)"
  },
  {
    "firm": "Carmquin Property Appraisals",
    "address": "8759 Commercial St",
    "city": "New Minas",
    "province": "NS",
    "phone": "902-681-5868"
  },
  {
    "firm": "CDC Consulting Services Inc. - NS",
    "address": "1959 Upper Water Street, Suite 1301, Tower 1",
    "city": "Halifax",
    "province": "NS",
    "phone": "1-866-479-7922"
  },
  {
    "firm": "Cobequid Appraisal",
    "address": "410 - 73 Coburg Cres Apartment Building",
    "city": "Truro",
    "province": "NS",
    "phone": "902-895-4475"
  },
  {
    "firm": "Cornerstone Home Appraisals",
    "address": "P.O. Box 500",
    "city": "Annapolis Royal",
    "province": "NS",
    "phone": "902-665-5220 OR Cell: 902-665-5220"
  },
  {
    "firm": "Fennell Associates & Appraisers Inc.",
    "address": "3600 Kempt Road Ste 209",
    "city": "Halifax",
    "province": "NS",
    "phone": "902-453-5051 or 902-441-0268"
  },
  {
    "firm": "G. Ratchford & Associates Inc",
    "address": "P O Box 5",
    "city": "North Sydney",
    "province": "NS",
    "phone": "902-565-8232"
  },
  {
    "firm": "Highland Appraisals",
    "address": "4588 West Lake Ainslie",
    "city": "Cape Breton",
    "province": "NS",
    "phone": "902-756-3403"
  },
  {
    "firm": "JF MacIvor Properties",
    "address": "P.O. Box 686",
    "city": "New Glasgow",
    "province": "NS",
    "phone": "902-755-4250"
  },
  {
    "firm": "Kempton Appraisals Ltd.",
    "address": "376 Portland St",
    "city": "Dartmouth",
    "province": "NS",
    "phone": "902-465-3000 OR 902-209-9194"
  },
  {
    "firm": "Kennedy Appraisals (NS)",
    "address": "48 O'Neil Lane",
    "city": "Glace Bay",
    "province": "NS",
    "phone": "902-565-6728"
  },
  {
    "firm": "Mackey Appraisal Ltd.",
    "address": "4 Kimar Drive",
    "city": "Coxheath",
    "province": "NS",
    "phone": "902-565-6373"
  },
  {
    "firm": "Malcolm S. Tizzard",
    "address": "1036 Kolbec Road",
    "city": "Oxford",
    "province": "NS",
    "phone": "902-664-6699"
  },
  {
    "firm": "Mari-Tech Appraisal & Inspection",
    "address": "5 Waddell Avenue",
    "city": "Dartmouth",
    "province": "NS",
    "phone": "902-468-4183"
  },
  {
    "firm": "Nova West Valuations",
    "address": "Box 8",
    "city": "Churchpoint",
    "province": "NS",
    "phone": "902-778-1017"
  },
  {
    "firm": "R & J Appraisals",
    "address": "Box 133",
    "city": "Aylesford",
    "province": "NS",
    "phone": "902-765-3323"
  },
  {
    "firm": "Remax Banner",
    "address": "284 Main St",
    "city": "Middleton",
    "province": "NS",
    "phone": "902-825-4679"
  },
  {
    "firm": "Sterling Property Appraisals & Consulting Ltd.",
    "address": "39 Sandycove Loop",
    "city": "Chester Basin",
    "province": "NS",
    "phone": "902-275-8168"
  },
  {
    "firm": "The MacKay Group Ltd.",
    "address": "179 Munroe Ave Exten",
    "city": "Westville Road",
    "province": "NS",
    "phone": "902-755-2858"
  },
  {
    "firm": "W. Black & Sons R.E. Ltd.",
    "address": "680 Shore Rd",
    "city": "Sydney Mines",
    "province": "NS",
    "phone": "902-794-4343"
  },
  {
    "firm": "1000418501 Ontario Inc. (Prev Georgian Property Appraisals)",
    "address": "3-1565 16th Street East, Suite 130",
    "city": "Owen Sound",
    "province": "ON",
    "phone": "519-376-2821"
  },
  {
    "firm": "24 Appraisal Inc",
    "address": "27 Craigmont Drive",
    "city": "Toronto",
    "province": "ON",
    "phone": "800-275-6590  OR  416-887-6658"
  },
  {
    "firm": "A&M Property Appraisals Ltd.",
    "address": "22 Wilcox Street",
    "city": "Timmins",
    "province": "ON",
    "phone": "705-531-3111"
  },
  {
    "firm": "A.L.L Appraisal Services Ltd.",
    "address": "21 Thames Avenue",
    "city": "Etobicoke",
    "province": "ON",
    "phone": "855-201-6808"
  },
  {
    "firm": "Aaron Appraisals",
    "address": "19 Kew Gardens",
    "city": "Richmond Hill",
    "province": "ON",
    "phone": "416-480-9162"
  },
  {
    "firm": "AAS - Accurate Appraisal Services Inc",
    "address": "199 EJ's Lane",
    "city": "Smith Falls",
    "province": "ON",
    "phone": "613-227-9227"
  },
  {
    "firm": "Accredited Appraisal Services",
    "address": "3164 Burnhamthorpe Road West",
    "city": "Oakville",
    "province": "ON",
    "phone": "416-729-4395  OR 855-202-9090"
  },
  {
    "firm": "Accurate (Peel) Appraisals Inc.",
    "address": "10 McColl Drive",
    "city": "Caledon",
    "province": "ON",
    "phone": "905-838-2490"
  },
  {
    "firm": "Accurate Appraisal",
    "address": "442 Grandview Avenue",
    "city": "London",
    "province": "ON",
    "phone": "519-280-1008"
  },
  {
    "firm": "Advance Appraisals Inc.",
    "address": "8171 Younge Street, Suite 250",
    "city": "Markham",
    "province": "ON",
    "phone": "(647)692-6662"
  },
  {
    "firm": "Affiliated Property Group (Ontario)",
    "address": "25B Northside Road",
    "city": "Ottawa",
    "province": "ON",
    "phone": "613-728-3991  ext #263"
  },
  {
    "firm": "Alexander McMillan R.E. Appraisal Services",
    "address": "6562 6th Concession Rd",
    "city": "Addison",
    "province": "ON",
    "phone": "613-341-9583  OR  613-258-0556"
  },
  {
    "firm": "Appear Appraisals",
    "address": "2250 Bovaird Dr East",
    "city": "Brampton",
    "province": "ON",
    "phone": "647-896-4265"
  },
  {
    "firm": "Appraisal Advantage Canada Incorporated",
    "address": "4936 Yonge St Suite 242",
    "city": "Toronto",
    "province": "ON",
    "phone": "416-570-6489"
  },
  {
    "firm": "Appraisal Connection",
    "address": "104 Venice Cres.",
    "city": "Thornhill",
    "province": "ON",
    "phone": "905-762-8977"
  },
  {
    "firm": "Appraisal Group (Thunder Bay)",
    "address": "291 Court St South",
    "city": "Thunder Bay",
    "province": "ON",
    "phone": "807 344 8886  OR  807-626-3526"
  },
  {
    "firm": "Appraisal One",
    "address": "3072 Leo Avenue",
    "city": "Greater Sudbury",
    "province": "ON",
    "phone": "705-897-1296/705-691-6664"
  },
  {
    "firm": "Appraisals by C & G Inc",
    "address": "245 Wembley Drive",
    "city": "Sudbury",
    "province": "ON",
    "phone": "705-522-7213"
  },
  {
    "firm": "Appraisals Completed Ltd.",
    "address": "871 Woollen Mill Rd, Conc. 6  Woodhouse",
    "city": "Simcoe",
    "province": "ON",
    "phone": "519-420-8755"
  },
  {
    "firm": "Appraisals Niagara Real Estate Appraisers Inc.",
    "address": "5773 Depew Avenue",
    "city": "Niagara Falls",
    "province": "ON",
    "phone": "905-357-7187"
  },
  {
    "firm": "Appraisals North Realty Inc.",
    "address": "66 Elm Street, Suite 301",
    "city": "Sudbury",
    "province": "ON",
    "phone": "705-688-9300"
  },
  {
    "firm": "Area Real Estate Appraisers Inc.",
    "address": "853 Queen St East",
    "city": "Sault Ste Marie",
    "province": "ON",
    "phone": "705-759-2072"
  },
  {
    "firm": "Assurance Appraisal Inc.",
    "address": "2805 - 13035 Yonge St",
    "city": "Richmond Hill",
    "province": "ON",
    "phone": "416-471-0176  OR 647-800-4876"
  },
  {
    "firm": "Austin & Austin Realty",
    "address": "Box 790  3-35 Whyte Ave",
    "city": "Dryden",
    "province": "ON",
    "phone": "807-223-6215"
  },
  {
    "firm": "B C Appraisals Inc.",
    "address": "54 Ross Ave N",
    "city": "Simcoe",
    "province": "ON",
    "phone": "519-426-3388  OR   877-598-3388"
  },
  {
    "firm": "B.E. Page Appraisal Services Inc.",
    "address": "91 Neywash St",
    "city": "Orillia",
    "province": "ON",
    "phone": "705-350-1574"
  },
  {
    "firm": "Baayen & Associates",
    "address": "273 Parkview Hills Dr.",
    "city": "Cobourg",
    "province": "ON",
    "phone": "905-373-6990"
  },
  {
    "firm": "Baayen & Associates Appraisers",
    "address": "347 Pido Road, Unit 7",
    "city": "Peterborough",
    "province": "ON",
    "phone": "(705)745-7777"
  },
  {
    "firm": "Barker Real Estate Appraisals",
    "address": "4 McLaughlin Road S",
    "city": "Brampton",
    "province": "ON",
    "phone": "905-451-6220 or 416-346-6065"
  },
  {
    "firm": "Barrons Real Estate Appraisals",
    "address": "1319 Exmouth St., Sarnia",
    "city": "Sarnia",
    "province": "ON",
    "phone": "519-542-1533   OR  647-962-5796"
  },
  {
    "firm": "Bayline Real Estate Ltd.",
    "address": "1007 McDonald Road",
    "city": "Foot's Bay",
    "province": "ON",
    "phone": "705-375-2333"
  },
  {
    "firm": "Bellai & Associates Appraisal Services",
    "address": "39 Walman Dr.",
    "city": "Guelph",
    "province": "ON",
    "phone": "519-821-7859"
  },
  {
    "firm": "Berk Appraisal Inc",
    "address": "1425 Osprey Drive",
    "city": "Ancaster",
    "province": "ON",
    "phone": "289-238-8621"
  },
  {
    "firm": "Blake Matlock & Marshal",
    "address": "75 First St., Suite 106",
    "city": "Orangeville",
    "province": "ON",
    "phone": "519-940-0900"
  },
  {
    "firm": "Bob Jugovic Real Estate Ltd",
    "address": "47 Ottawa Street",
    "city": "North Hamilton",
    "province": "ON",
    "phone": "905-544-2863"
  },
  {
    "firm": "Bod Real Estate Appraisals, Valuations and Advisory",
    "address": "50 Stammers Drive",
    "city": "Ajax",
    "province": "ON",
    "phone": "289-992-7562"
  },
  {
    "firm": "Bona Fide Appraisals Inc",
    "address": "348-610 Ford Drive",
    "city": "Oakville",
    "province": "ON",
    "phone": "905-901-4926"
  },
  {
    "firm": "Boot Appraisal Services Limited",
    "address": "2233 Woodglade Blvd",
    "city": "Peterborough",
    "province": "ON",
    "phone": "705-740-2668"
  },
  {
    "firm": "Brant Residential Appraisals",
    "address": "22 Grace Ave",
    "city": "Brantford",
    "province": "ON",
    "phone": "519-753-6231"
  },
  {
    "firm": "Brighton Appraisals",
    "address": "303 6th Street",
    "city": "Hanover",
    "province": "ON",
    "phone": "519 364-0694"
  },
  {
    "firm": "Brisson & Associates",
    "address": "578 Mcgill St",
    "city": "Hawkesbury",
    "province": "ON",
    "phone": "613-632-3325"
  },
  {
    "firm": "Brox Appraisals Inc",
    "address": "126 Weber Street North",
    "city": "Waterloo",
    "province": "ON",
    "phone": "519-240-5390"
  },
  {
    "firm": "C. M. Bradshaw & Associates",
    "address": "P O Box 221",
    "city": "Foxboro",
    "province": "ON",
    "phone": "613-968-9919  OR 613-328-6036"
  },
  {
    "firm": "CDC Consulting Services Inc. - ON",
    "address": "TD Canada Trust Tower 161 Bay St, 27 Floor",
    "city": "Toronto",
    "province": "ON",
    "phone": "1-866-479-7922"
  },
  {
    "firm": "Chantal Lavigne",
    "address": "134 Ivy Avenue",
    "city": "Renfrew",
    "province": "ON",
    "phone": "613-433-3736"
  },
  {
    "firm": "Charles Bell Real Estate Appraisals Ltd.",
    "address": "130 Paris Street",
    "city": "Sudbury",
    "province": "ON",
    "phone": "705-671-2355   OR  705-561-0807"
  },
  {
    "firm": "Chris Dopko Appraisal Services",
    "address": "Box 2 Unit 13",
    "city": "Stoney Creek",
    "province": "ON",
    "phone": "(905) 516-8584"
  },
  {
    "firm": "Consolidated Appraisal Service Ltd",
    "address": "241 Minet's Point Rd",
    "city": "Barrie",
    "province": "ON",
    "phone": "705-717-2353"
  },
  {
    "firm": "Constant Appraisals Ltd",
    "address": "6193 Duford Dr",
    "city": "Mississauga",
    "province": "ON",
    "phone": "416 566 2515"
  },
  {
    "firm": "Cornerstone Appraisal Services",
    "address": "12 Aspenwood Place",
    "city": "Guelph",
    "province": "ON",
    "phone": "519-822-2126"
  },
  {
    "firm": "Coulson & Company Appraisal Ltd. ( Prev Coulson Appraisals Ltd.)",
    "address": "2349 Fairview St, Unit 312",
    "city": "Burlington",
    "province": "ON",
    "phone": "905-333-3140"
  },
  {
    "firm": "Creditview Appraisals Inc",
    "address": "14 Jevins Close",
    "city": "Brampton",
    "province": "ON",
    "phone": "416-402-5744"
  },
  {
    "firm": "Dennis J Murphy, Appraiser",
    "address": "136 Crompton Dr",
    "city": "Barrie",
    "province": "ON",
    "phone": "705-737-5100"
  },
  {
    "firm": "Denomme Appraisals",
    "address": "328 First St",
    "city": "Collingwood",
    "province": "ON",
    "phone": "705-446-6498"
  },
  {
    "firm": "DK Appraisals",
    "address": "49 Lesabre Crescent",
    "city": "Brampton",
    "province": "ON",
    "phone": "647-893-1311"
  },
  {
    "firm": "DRW Appraisal Inc.",
    "address": "2 Price St, P.O Box #204",
    "city": "Brooklin",
    "province": "ON",
    "phone": "905-995-3966"
  },
  {
    "firm": "EM Hick Appraisals",
    "address": "67 Bridge Street East",
    "city": "Campbellford",
    "province": "ON",
    "phone": "705-653-7230"
  },
  {
    "firm": "Enns MacEachern Pace Maloney",
    "address": "850 Boundary Road, Unit #10",
    "city": "Cornwall",
    "province": "ON",
    "phone": "613-932-1812"
  },
  {
    "firm": "ES Gorski Realty Ltd",
    "address": "2525 Rose Ville Garden",
    "city": "Windsor",
    "province": "ON",
    "phone": "519-966-9940"
  },
  {
    "firm": "Essential Appraisal Services Ltd.",
    "address": "2727 Courtice Road PO Box 98011",
    "city": "Courtice",
    "province": "ON",
    "phone": "905-432-7111 / 905-925-6272"
  },
  {
    "firm": "Everest Appraisal Services",
    "address": "47 Albery Crescent",
    "city": "Ajax",
    "province": "ON",
    "phone": "905-686-3172"
  },
  {
    "firm": "F.K. Mitchell Appraisals Inc.",
    "address": "300 Eugent Street East Unit B",
    "city": "Windsor",
    "province": "ON",
    "phone": "519-966-9613"
  },
  {
    "firm": "F.R. Jordan & Associates",
    "address": "120 - 3005 Marentette Avenue",
    "city": "Windsor",
    "province": "ON",
    "phone": "519-974-0186"
  },
  {
    "firm": "Fletcher Professional Realty Appraisal",
    "address": "1174 Woodington Lane",
    "city": "Oakville",
    "province": "ON",
    "phone": "905-829-4916"
  },
  {
    "firm": "Genesis Appraisals",
    "address": "151 Nashdene Rd U47",
    "city": "Scarborough",
    "province": "ON",
    "phone": "416-292-4343"
  },
  {
    "firm": "Genesis Appraisals Ltd.",
    "address": "#57 - 550 Sandison St",
    "city": "Windsor",
    "province": "ON",
    "phone": "519-800-4248  OR  647-839-7066"
  },
  {
    "firm": "Gifford Appraisals",
    "address": "P.O. Box 603",
    "city": "Pickering",
    "province": "ON",
    "phone": "905-683-2637"
  },
  {
    "firm": "Grand River Real Estate Appraisals",
    "address": "12 Starview Crescent",
    "city": "Guelph",
    "province": "ON",
    "phone": "226-444-6119"
  },
  {
    "firm": "Hanover Realty Appraisal (AKA Brighton Appraisals)",
    "address": "303 - 6th St",
    "city": "Hanover",
    "province": "ON",
    "phone": "519 364-0694"
  },
  {
    "firm": "Harbourview Property Services",
    "address": "120 Melville St",
    "city": "Hamilton",
    "province": "ON",
    "phone": "905-577-3003"
  },
  {
    "firm": "Harry and Company",
    "address": "141 St Clair Street",
    "city": "Chatham",
    "province": "ON",
    "phone": "519-436-6161"
  },
  {
    "firm": "Harvey Dawe Realty Ltd.",
    "address": "77 Russell St W",
    "city": "Lindsay",
    "province": "ON",
    "phone": "705-324-9488"
  },
  {
    "firm": "Hastings Appraisal Services",
    "address": "459 Dundas St., W.",
    "city": "Trenton",
    "province": "ON",
    "phone": "613-392-1818"
  },
  {
    "firm": "Hendren Alcamo Appraisals (Prev Hendren Appraisals)",
    "address": "44 Queen Street E",
    "city": "Brampton",
    "province": "ON",
    "phone": "905-450-3307  OR   905-450-3316"
  },
  {
    "firm": "HG Appraisers Inc.",
    "address": "297 Ste. Marie St.",
    "city": "Collingwood",
    "province": "ON",
    "phone": "705-445-7414"
  },
  {
    "firm": "Holmes Appraisals",
    "address": "769 Allum Ave",
    "city": "Kingston",
    "province": "ON",
    "phone": "613-530-0726"
  },
  {
    "firm": "Homefacts R E Services",
    "address": "71 Fairwood Pl W",
    "city": "Burlington",
    "province": "ON",
    "phone": "905-333-3321"
  },
  {
    "firm": "Hugh R. Fay & Associates",
    "address": "1405 Pope Street",
    "city": "LaSalle",
    "province": "ON",
    "phone": "519-978-0551"
  },
  {
    "firm": "Hutchesson Appraisals (formerly Hutchesson, Gignac Ltd.)",
    "address": "8 Seely Court",
    "city": "Wasaga Beach",
    "province": "ON",
    "phone": "705-352-1777"
  },
  {
    "firm": "iAppraise Inc.",
    "address": "3191 Saltaire Cres.",
    "city": "Oakville",
    "province": "ON",
    "phone": "1-888-749-4649"
  },
  {
    "firm": "Independent Appraisal Corp.",
    "address": "21 - 5330 canotek Road",
    "city": "Ottawa",
    "province": "ON",
    "phone": "613-564-8282"
  },
  {
    "firm": "Jack Graves Realty Ltd",
    "address": "439 Broadway",
    "city": "Tillsonburg",
    "province": "ON",
    "phone": "519-842-9001"
  },
  {
    "firm": "Jeff Derochie Appraisal Service",
    "address": "3991 La Salle Woods  Blvd",
    "city": "Windsor",
    "province": "ON",
    "phone": "519-564-1703"
  },
  {
    "firm": "Jill Murphy & Associates Inc.",
    "address": "185 Robinson St",
    "city": "Oakville",
    "province": "ON",
    "phone": "905-338-9772"
  },
  {
    "firm": "John A. Shamess Appraisals",
    "address": "P.O. Box 452",
    "city": "Elliot Lake",
    "province": "ON",
    "phone": "705-848-6132"
  },
  {
    "firm": "John F. Gebal Real Estate Services",
    "address": "12 School Street",
    "city": "Chatham",
    "province": "ON",
    "phone": "519-354-1900"
  },
  {
    "firm": "Johnson Pietz Consulting",
    "address": "Box 632",
    "city": "Fonthill",
    "province": "ON",
    "phone": "905-892-0611"
  },
  {
    "firm": "K Baker Property Appraisals",
    "address": "62 Law Drive",
    "city": "Guelph",
    "province": "ON",
    "phone": "519-265-2575"
  },
  {
    "firm": "K. Murphy Real Estate Appraisal Services",
    "address": "102 Gladstone Ave",
    "city": "Chatham",
    "province": "ON",
    "phone": "519-359-4693"
  },
  {
    "firm": "Kahle Appraisers and Consultants",
    "address": "335 Redford Cr.",
    "city": "Stratford",
    "province": "ON",
    "phone": "519-273-5707"
  },
  {
    "firm": "Kawartha Lakes Appraisal",
    "address": "144 Adelaide St North",
    "city": "Lindsay",
    "province": "ON",
    "phone": "705-328-1399"
  },
  {
    "firm": "Keller Williams Ottawa Realty",
    "address": "610 Bronson Ave",
    "city": "Ottawa",
    "province": "ON",
    "phone": "613 236-5959"
  },
  {
    "firm": "Kennedy Appraisals Inc.",
    "address": "14519 Elginfield Road",
    "city": "Lucan",
    "province": "ON",
    "phone": "519 227-2092"
  },
  {
    "firm": "KF McComb Appraisal Services",
    "address": "898 Queen St East",
    "city": "Sault Ste Marie",
    "province": "ON",
    "phone": "705-946-2696"
  },
  {
    "firm": "Kitchen & Company Appraisal Services",
    "address": "155 Manitoba Street, PO Box 2260",
    "city": "Bracebridge",
    "province": "ON",
    "phone": "705-645-3210  OR  800-268-4836"
  },
  {
    "firm": "KS Appraisal Services",
    "address": "22 Oriole Cres,",
    "city": "Baltimore",
    "province": "ON",
    "phone": "905-269-3937"
  },
  {
    "firm": "L.A. Mirotta & Company",
    "address": "70 Hazelwood Drive",
    "city": "Guelph",
    "province": "ON",
    "phone": "519-242-4172"
  },
  {
    "firm": "Lakeland Appraisals",
    "address": "260 Summit Drive",
    "city": "Huntsville",
    "province": "ON",
    "phone": "705-783-0808"
  },
  {
    "firm": "Landry's for Real Estate",
    "address": "231 First St. S",
    "city": "Kenora",
    "province": "ON",
    "phone": "807-468-9871"
  },
  {
    "firm": "Laser Appraiser",
    "address": "Box 179",
    "city": "Millgrove",
    "province": "ON",
    "phone": "905-659-0758"
  },
  {
    "firm": "Latitude 50 Realty",
    "address": "165 1st Street, Box 758",
    "city": "Dryden",
    "province": "ON",
    "phone": "807-223-4950"
  },
  {
    "firm": "Lea Robertson, CRA",
    "address": "70 King William St",
    "city": "Huntsville",
    "province": "ON",
    "phone": "705-789-4957"
  },
  {
    "firm": "Leander Property Appraisals Inc.",
    "address": "155 East Beaver Creek Rd #24, Suite 315",
    "city": "Richmond Hill",
    "province": "ON",
    "phone": "905-841-1841"
  },
  {
    "firm": "LeBreton Appraisal Services",
    "address": "87 Woodroffe Ave",
    "city": "Ottawa",
    "province": "ON",
    "phone": "613-761-9969,  613-889-4883,   613-889-3227"
  },
  {
    "firm": "Leslie T. Weatherby Realty",
    "address": "272 Wellington Street",
    "city": "Kingston",
    "province": "ON",
    "phone": "613-542-4935"
  },
  {
    "firm": "LOCC R. E Appraisal Inc.",
    "address": "559 Exmouth Street",
    "city": "Sarnia",
    "province": "ON",
    "phone": "519-344-5622"
  },
  {
    "firm": "Loewen Appraisal Services",
    "address": "367 Talbot St",
    "city": "St Thomas",
    "province": "ON",
    "phone": "519-636-7087"
  },
  {
    "firm": "M K Espie Appraisals & Consulting",
    "address": "463 Victoria Street",
    "city": "Port Perry",
    "province": "ON",
    "phone": "905-432-4636"
  },
  {
    "firm": "M Machel & Associates Ltd.",
    "address": "332 Charles St. E",
    "city": "Kitchener",
    "province": "ON",
    "phone": "519-578-5444"
  },
  {
    "firm": "Maker Real Estate Appraisals Inc",
    "address": "210 Leameadow Rd",
    "city": "Thornhill",
    "province": "ON",
    "phone": "416-996-8348"
  },
  {
    "firm": "McIver Group Inc",
    "address": "238 Piccadilly Street",
    "city": "London",
    "province": "ON",
    "phone": "519-673-0000 Ext 10"
  },
  {
    "firm": "Michel Rozon Evaluateur (Prev Michel Rozon & Associates)",
    "address": "836 Royal Ave",
    "city": "Hawkesbury",
    "province": "ON",
    "phone": "613-551-9747 / 613-636-0147"
  },
  {
    "firm": "Mid - North Appraisals Ltd.",
    "address": "745 Valley View Drive West",
    "city": "Powassan",
    "province": "ON",
    "phone": "705-724-6348"
  },
  {
    "firm": "Midland Appraisals",
    "address": "480 Elizabeth Street",
    "city": "Midland",
    "province": "ON",
    "phone": "705-528-4040  OR  705-527-6481"
  },
  {
    "firm": "Midtown Appraisal Group Inc",
    "address": "34 Dundas Street",
    "city": "Dundas",
    "province": "ON",
    "phone": "289-238-9199"
  },
  {
    "firm": "Modern Appraisals Inc.",
    "address": "#3 291 Eighth Avenue",
    "city": "Cochrane",
    "province": "ON",
    "phone": "705-269-1668"
  },
  {
    "firm": "Morland Appraisals",
    "address": "382 Fraser Street",
    "city": "North Bay",
    "province": "ON",
    "phone": "705-471-0074 / 705- 474-3508"
  },
  {
    "firm": "Murray A Farrell & Associates",
    "address": "515 Dundas Street",
    "city": "Woodstock",
    "province": "ON",
    "phone": "519-539-0413"
  },
  {
    "firm": "Murray Appraisals",
    "address": "74 Redford Crescent",
    "city": "Stratford",
    "province": "ON",
    "phone": "519-273-2671"
  },
  {
    "firm": "MW Cotman & Associates (formerly McGugan & Ass.)",
    "address": "1035 Len Birchall Way",
    "city": "Kingston",
    "province": "ON",
    "phone": "613-634-2223"
  },
  {
    "firm": "North Broadfoot Gribbon Inc",
    "address": "1035 Red Spruce Street",
    "city": "Ottawa",
    "province": "ON",
    "phone": "613-727-2677"
  },
  {
    "firm": "North Muskoka Appraisals",
    "address": "1672 Williamsport Road",
    "city": "Huntsville",
    "province": "ON",
    "phone": "705-380-5485  /  c: 705-787-5485"
  },
  {
    "firm": "Northern Ontario Appraisals",
    "address": "278 Toke Street",
    "city": "Timmins",
    "province": "ON",
    "phone": "705-268-6600"
  },
  {
    "firm": "Ottawa Carlton Appraisal",
    "address": "11 Tarquin Cres",
    "city": "Nepean",
    "province": "ON",
    "phone": "613-790-1802"
  },
  {
    "firm": "PAC Appraisal Inc",
    "address": "#210, 6740 Davand Drive",
    "city": "Mississauga",
    "province": "ON",
    "phone": "905-281-3220 Ext. 304,"
  },
  {
    "firm": "Paul Raymer Appraisals",
    "address": "PO Box 427",
    "city": "Markham",
    "province": "ON",
    "phone": "905-294-1267"
  },
  {
    "firm": "Pinpoint Appraisers Inc",
    "address": "1110 Elizabeth St. PO Box 5",
    "city": "Sharbot Lake",
    "province": "ON",
    "phone": "613-279-9303  /  C: 613-539-8098"
  },
  {
    "firm": "Precise Real Estate Appraising Inc.",
    "address": "23134 - 500 Fairway Rd. S",
    "city": "Kitchener",
    "province": "ON",
    "phone": "519-221-2224"
  },
  {
    "firm": "Premier Appraisal Services Inc",
    "address": "8 McClarnan Road",
    "city": "Ajax",
    "province": "ON",
    "phone": "905-619-9523"
  },
  {
    "firm": "Premier Valuations & Consulting (Prev Patrol Property Service)",
    "address": "#102 - 111 Heritage Rd",
    "city": "Chatham",
    "province": "ON",
    "phone": "519-397-1133"
  },
  {
    "firm": "Professional Appraisal Associates",
    "address": "1856 Marconi Blvd",
    "city": "London",
    "province": "ON",
    "phone": "519-639-3087"
  },
  {
    "firm": "Progressive Appraisal Services Inc",
    "address": "20531 Purple Hill Road",
    "city": "Thorndale",
    "province": "ON",
    "phone": "519-461-9468"
  },
  {
    "firm": "Property Valuators Consulting Inc&nbsp; (PVCI Inc.)",
    "address": "S207 - 209 Dundas Street East",
    "city": "Whitby",
    "province": "ON",
    "phone": "905-666-5023  OR  905-242-4524"
  },
  {
    "firm": "PVCI Inc. (Property Valuators Consulting Inc.)",
    "address": "182 Wellington Street West",
    "city": "Bowmanville",
    "province": "ON",
    "phone": "905-623-6023"
  },
  {
    "firm": "R.A. Critchlow Realty",
    "address": "20 Mill St., W.,",
    "city": "Leamington",
    "province": "ON",
    "phone": "519-326-6154"
  },
  {
    "firm": "R.J. Lyons Real Estate Appraisal Services",
    "address": "6-575 Wharncliffe Rd S",
    "city": "London",
    "province": "ON",
    "phone": "519-672-0485"
  },
  {
    "firm": "Real Estate Appraising and Consulting",
    "address": "6 George Street North",
    "city": "Cambridge",
    "province": "ON",
    "phone": "519-725-0244"
  },
  {
    "firm": "Regional Appraisals Inc",
    "address": "3521 Portage Road, Unit A",
    "city": "Niagara Falls",
    "province": "ON",
    "phone": "905-356-6646"
  },
  {
    "firm": "Reliable Appraisal Services",
    "address": "5659 McAdam Road, #A6",
    "city": "Mississauga",
    "province": "ON",
    "phone": "905-7122-8887"
  },
  {
    "firm": "Ridley & Associates",
    "address": "50 William St",
    "city": "St. Catharines",
    "province": "ON",
    "phone": "905-685-8827"
  },
  {
    "firm": "Rivington Appraisers Inc. (AKA J Rivington Appraisers & Rivington Associates))",
    "address": "16 Gore St W",
    "city": "Perth",
    "province": "ON",
    "phone": "613-326-1227 or 613-267-68000"
  },
  {
    "firm": "Rivingtons of Pembroke Inc.",
    "address": "655 Pembroke St W",
    "city": "Pembroke",
    "province": "ON",
    "phone": "(613) 735-4627"
  },
  {
    "firm": "Ron Merkley Real Estate & App.",
    "address": "21 Apple Street",
    "city": "Brockville",
    "province": "ON",
    "phone": "613-342-5060"
  },
  {
    "firm": "Ron Poliwoda R.E. Appraiser",
    "address": "59 Mountbatten Road",
    "city": "Thornhill",
    "province": "ON",
    "phone": "905-709-8634"
  },
  {
    "firm": "Royal Lepage Team Advantage Realty",
    "address": "49 James Street",
    "city": "Parry Sound",
    "province": "ON",
    "phone": "705-746-5844"
  },
  {
    "firm": "S L Purdy & Associates Ltd.",
    "address": "PO Box 209",
    "city": "Coe Hill",
    "province": "ON",
    "phone": "613-827-7849"
  },
  {
    "firm": "S. Rayner & Associates Ltd.",
    "address": "1225 Gardubers Rd,  #103",
    "city": "Kingston",
    "province": "ON",
    "phone": "613-384-8921  OR  613-217-1950"
  },
  {
    "firm": "S.W. Irvine & Asslociates",
    "address": "155 Suffolk Street W, 2nd floor",
    "city": "Guelph",
    "province": "ON",
    "phone": "519-763-5956"
  },
  {
    "firm": "Scanlon & Associates",
    "address": "332 Mississauga St W.",
    "city": "Orillia",
    "province": "ON",
    "phone": "705-326-2531"
  },
  {
    "firm": "Schinkel Real Estate & Appraisals Inc.",
    "address": "440 King Street West",
    "city": "Hamilton",
    "province": "ON",
    "phone": "905-387-0100"
  },
  {
    "firm": "Schleifer & Associates (Anthony Schleifer)",
    "address": "781 Thompson Rd",
    "city": "Waterford",
    "province": "ON",
    "phone": "519-753-1901"
  },
  {
    "firm": "Shields Appraisals & Consulting Ltd.",
    "address": "875 Queen Street East, Suite 3",
    "city": "Sault Ste Marie",
    "province": "ON",
    "phone": "705-542-8830  or  705-257-1524"
  },
  {
    "firm": "Simon & Associates Ltd.",
    "address": "60 Marycroft Avenue, Unit 6",
    "city": "Vaughan",
    "province": "ON",
    "phone": "416-398-1234 X223"
  },
  {
    "firm": "South Coast Appraisals",
    "address": "157 King Lane",
    "city": "Simcoe",
    "province": "ON",
    "phone": "519-428-9916"
  },
  {
    "firm": "Sovereign Appraisals Ltd.",
    "address": "PO Box 353",
    "city": "Windsor",
    "province": "ON",
    "phone": "519-966-0222"
  },
  {
    "firm": "Sprint Residential Appraisals",
    "address": "389 Cooper Street",
    "city": "Cambridge",
    "province": "ON",
    "phone": "519-241-1631 / 519-208-7288"
  },
  {
    "firm": "Stanshall & Associates",
    "address": "26 Marigold St",
    "city": "Brantford",
    "province": "ON",
    "phone": "519-750-1761"
  },
  {
    "firm": "Steele & Associates - North Bay",
    "address": "55 Nancy Drive",
    "city": "North Bay",
    "province": "ON",
    "phone": "705-995-3220"
  },
  {
    "firm": "Steele & Associates - TImmins",
    "address": "312 Patricia Blvd.",
    "city": "Timmins",
    "province": "ON",
    "phone": "705-471-1173"
  },
  {
    "firm": "Swan Appraisals Inc.",
    "address": "Box 220 - 46 Walker Road",
    "city": "Perkinsfield",
    "province": "ON",
    "phone": "705-526-2200"
  },
  {
    "firm": "T.R. Yuill Appraisal Services",
    "address": "675 William Ave. Unit 21",
    "city": "Sudbury",
    "province": "ON",
    "phone": "705-690-4744"
  },
  {
    "firm": "Talbot Appraisal Services",
    "address": "204 Em St",
    "city": "St Thomas",
    "province": "ON",
    "phone": "519-633-9150"
  },
  {
    "firm": "Tarle & McAllister Appraisals",
    "address": "1664 Birmingham St",
    "city": "Cornwall",
    "province": "ON",
    "phone": "613-937-4912"
  },
  {
    "firm": "The Appraisal Company",
    "address": "14 Clifford Street",
    "city": "St. Catherines",
    "province": "ON",
    "phone": "905-937-7792, Cell 905-329-0197"
  },
  {
    "firm": "The Real Estate Consulting Group",
    "address": "55 Eglinton Ave. E. #310",
    "city": "Toronto",
    "province": "ON",
    "phone": "416-322-7888"
  },
  {
    "firm": "Tiller Appraisals",
    "address": "21 Hopkins Road",
    "city": "Barrie",
    "province": "ON",
    "phone": "705-718-9211"
  },
  {
    "firm": "TM Appraisers Inc.",
    "address": "80 Micro Court, Suite 102",
    "city": "Markham",
    "province": "ON",
    "phone": "416-324-2939 OR  647-385-8238"
  },
  {
    "firm": "Top Class Appraisal",
    "address": "77006-6579 HWY 7",
    "city": "Markham",
    "province": "ON",
    "phone": "416-569-9792  OR  613-366-2068"
  },
  {
    "firm": "Town & Country Appraisals",
    "address": "158 East 8th Street",
    "city": "Hamilton",
    "province": "ON",
    "phone": "905-318-1577"
  },
  {
    "firm": "Tracey Brisson Appraisals",
    "address": "1176 St Augutin Street, PO Box 113",
    "city": "Embrun",
    "province": "ON",
    "phone": "613-863-5047"
  },
  {
    "firm": "Tri County Appraisals",
    "address": "RR #6, 6926 Richmond Road",
    "city": "Aylmer",
    "province": "ON",
    "phone": "519-671-6918"
  },
  {
    "firm": "True North Realty Ltd.",
    "address": "20 Stewart Ave.",
    "city": "Kapuskasing",
    "province": "ON",
    "phone": "705-335-2361"
  },
  {
    "firm": "Van Walraven Appraisals Inc.",
    "address": "College Squre, P.O. Box 33053, 1363B Woodroffe Avenue",
    "city": "Ottawa",
    "province": "ON",
    "phone": "613-226-1590 / 866-458-7553"
  },
  {
    "firm": "VAO",
    "address": "6015 Church's Lane",
    "city": "Niagara Falls",
    "province": "ON",
    "phone": "416-509-5415"
  },
  {
    "firm": "Walker & Walker Appraisal Ltd",
    "address": "211, 2349 Fairview St",
    "city": "Burlington",
    "province": "ON",
    "phone": "905-639-0235"
  },
  {
    "firm": "Warnica-Poste Appraisals Inc.",
    "address": "16A  Janice Dr",
    "city": "Barrie",
    "province": "ON",
    "phone": "705-739-0240"
  },
  {
    "firm": "Waterside Real Estate Group",
    "address": "110 Mcgregor Crescent",
    "city": "Ancaster",
    "province": "ON",
    "phone": "905-333-3321"
  },
  {
    "firm": "Wayne Elliot Appraisal Services",
    "address": "68 Queensway W",
    "city": "Simcoe",
    "province": "ON",
    "phone": "519-426-000"
  },
  {
    "firm": "Wellington Appraisal",
    "address": "340 Woolwich St",
    "city": "Guelph",
    "province": "ON",
    "phone": "519-766-1500"
  },
  {
    "firm": "Westview Appraisal Services",
    "address": "2233 Argentia Rd Ste 302, East Tower",
    "city": "Mississauga",
    "province": "ON",
    "phone": "905-821-2062"
  },
  {
    "firm": "Wieland & Associates",
    "address": "343 Preston Street, suite 1101",
    "city": "Ottawa",
    "province": "ON",
    "phone": "1-844-943-5263  /  CELL: 613-795-4427"
  },
  {
    "firm": "Woodview Real Estate Appraisals",
    "address": "7 - 475 Woodview Road",
    "city": "Burlington",
    "province": "ON",
    "phone": "905-630-2600"
  },
  {
    "firm": "York Simcoe Appraisals Corp",
    "address": "P O Box 93026",
    "city": "Newmarket",
    "province": "ON",
    "phone": "905-773-6480  OR  905-836-1028"
  },
  {
    "firm": "A3 - Accredited Appraisal Associates",
    "address": "93 Edward St",
    "city": "Charlottetown",
    "province": "PE",
    "phone": "902-388-0251"
  },
  {
    "firm": "Brad Oliver Realty Inc.",
    "address": "Box 1349, 3 Rink Street",
    "city": "Monteague",
    "province": "PE",
    "phone": "888-557-1616 or 905-969-8371"
  },
  {
    "firm": "Delaney Appraisal Services",
    "address": "11 Priscilla Place",
    "city": "Cornwall",
    "province": "PE",
    "phone": "902-393-5640"
  },
  {
    "firm": "Griffin Appraisal Services",
    "address": "34 Mount Edward Rd",
    "city": "Charlottetown",
    "province": "PE",
    "phone": "902-626-3456"
  },
  {
    "firm": "Harbord, Rogers & Associates",
    "address": "727 Nightingale Cres",
    "city": "Summerside",
    "province": "PE",
    "phone": "902-436-7203"
  },
  {
    "firm": "Quality Appraisal Services (PEI)",
    "address": "9 Yorkshire Drive",
    "city": "Charlottetown",
    "province": "PE",
    "phone": "902-628-9674"
  },
  {
    "firm": "9149-1845 Quebec INC",
    "address": "5780, P\u00e9loquin",
    "city": "Laval",
    "province": "QC",
    "phone": "514-899-0823"
  },
  {
    "firm": "Andr\u00e9 Paris \u00c9valuations Inc",
    "address": "2660 rue des chouettes",
    "city": "Terrebonne",
    "province": "QC",
    "phone": "514-923-1119"
  },
  {
    "firm": "Bourque,Dupere, Simard & Ass.",
    "address": "162, Boulevard Perron Ouest",
    "city": "New Richmond",
    "province": "QC",
    "phone": "418-392-5058"
  },
  {
    "firm": "CDC Consulting Services Inc. - QC",
    "address": "1250 Ren\u00e9 L\u00e9vesque Boulevard West, Suite 2200",
    "city": "Montreal",
    "province": "QC",
    "phone": "1-866-479-7922"
  },
  {
    "firm": "Daniel Bouchard Evaluateur Agree",
    "address": "1755, boulevard Lemire",
    "city": "Drummondville",
    "province": "QC",
    "phone": "819-479-8585"
  },
  {
    "firm": "Dufresne, Savary & Associes",
    "address": "275 Rue King Ouest",
    "city": "Sherbrooke",
    "province": "QC",
    "phone": "819-823-9715"
  },
  {
    "firm": "Evaluatech Chicoutimi/Jonquiere",
    "address": "425 boul. St-Paul",
    "city": "Chicoutimi",
    "province": "QC",
    "phone": "418-696-0248"
  },
  {
    "firm": "Evaluation 2000 Ltd",
    "address": "421 Rue Victoria",
    "city": "Edmundston",
    "province": "QC",
    "phone": "506-737-7120  OR  506-735-5548"
  },
  {
    "firm": "Evaluation Berube INC",
    "address": "1306 Aurele Street",
    "city": "Ottawa",
    "province": "QC",
    "phone": "613-552-4015"
  },
  {
    "firm": "Evaluation D. Leveille Inc.",
    "address": "440 boul. Albiny-Paquette",
    "city": "Mont Laurier",
    "province": "QC",
    "phone": "819-623-4481"
  },
  {
    "firm": "Evaluation Immobiliere Paquette",
    "address": "1184 rue Dufresne",
    "city": "Saint-Felicien",
    "province": "QC",
    "phone": "418 618-3256"
  },
  {
    "firm": "Evaluation SMP",
    "address": "214, rue De L'Atlas",
    "city": "Quebec",
    "province": "QC",
    "phone": "418-952-6728 /418-554-3520"
  },
  {
    "firm": "Evaluations Immobilieres Evimag Inc.",
    "address": "500 Ave Brochu",
    "city": "Sept-Iles",
    "province": "QC",
    "phone": "418-968-2444"
  },
  {
    "firm": "Evaluations Manicouagan Inc.",
    "address": "872 rue de puyjalon",
    "city": "Baie-Comeau",
    "province": "QC",
    "phone": "418-589-9005"
  },
  {
    "firm": "Evaluations Mauricie",
    "address": "3130, Notre-Dame-Est",
    "city": "Trois-Rivieres",
    "province": "QC",
    "phone": "819-372-9733"
  },
  {
    "firm": "Godbout, Joseph & Associates",
    "address": "350, av. de la Cath\u00e9drale, 2e \u00e9tage",
    "city": "Rimouski",
    "province": "QC",
    "phone": "418-723-7575"
  },
  {
    "firm": "Groupe Axival Boivin Couture",
    "address": "8724 boulevard Langelier",
    "city": "St. Leonard",
    "province": "QC",
    "phone": "514-899-0823"
  },
  {
    "firm": "Groupe Poulin Services Immobiliers Inc",
    "address": "2035, rue du Haut-Bord, bureau 315",
    "city": "Qu\u00e9bec",
    "province": "QC",
    "phone": "418-683-2929"
  },
  {
    "firm": "Groupe Proval \u00c9valuateurs Agr\u00e9\u00e9s",
    "address": "130 Chemin de la grande cote",
    "city": "Boisbriand",
    "province": "QC",
    "phone": "450-962-5837 and 514-382-5837"
  },
  {
    "firm": "Immobec Inc",
    "address": "2781, Quatre-Bourgeois",
    "city": "Quebec",
    "province": "QC",
    "phone": "418-473-5481"
  },
  {
    "firm": "Joe Tremblay Inc",
    "address": "350 Montee St Claud,e",
    "city": "Saint-Philippe",
    "province": "QC",
    "phone": "514-813-1758  OR  514-569-3704"
  },
  {
    "firm": "L' Immobiliere societe d evaluation conseil inc",
    "address": "72, Jacques-Cartier Ouest, 4e etage",
    "city": "Chicoutimi",
    "province": "QC",
    "phone": "418-543-7775"
  },
  {
    "firm": "Les Evaluations Pascal Arsenault",
    "address": "1201-A, 4ieme avenue",
    "city": "La Pocatiere",
    "province": "QC",
    "phone": "418-856-1958"
  },
  {
    "firm": "Les Evaluations Yves Gagnon Inc.",
    "address": "500 Av Brochu",
    "city": "Sept-Iles",
    "province": "QC",
    "phone": "418-968-2444"
  },
  {
    "firm": "Levesque Pires Caron & associes (Groupe LPCA) - Gatineau",
    "address": "101 rue Turgeon",
    "city": "Sainte-Th\u00e9r\u00e8se",
    "province": "QC",
    "phone": "(450) 435-1315"
  },
  {
    "firm": "Levesque Pires Caron & associes (Groupe LPCA) - Sainte-Therese",
    "address": "101, rue Turgeon, bureau 201",
    "city": "Sainte-Therese",
    "province": "QC",
    "phone": "450-435-1315"
  },
  {
    "firm": "Levesque Pires Caron & associes (Groupe LPCA) - Saint-Saveur",
    "address": "22, av. Lafleur Nord, bureau 201",
    "city": "Saint-Saveur",
    "province": "QC",
    "phone": "450-227-2063"
  },
  {
    "firm": "M.C. Evaluations",
    "address": "179A rue Notre-Dame",
    "city": "Maniwaiki",
    "province": "QC",
    "phone": "819-449-3687"
  },
  {
    "firm": "Martel Villemure & Chouinard INC",
    "address": "250 Rue Vachone, Bureau 201",
    "city": "Trois Rivieres",
    "province": "QC",
    "phone": "819-379-6809 #215"
  },
  {
    "firm": "Michel Paquin Evaluations Outaouais Inc.",
    "address": "306-383 boul Greber",
    "city": "Gatineau",
    "province": "QC",
    "phone": "(819) 243-3001"
  },
  {
    "firm": "Novea Inc.",
    "address": "1155 Rue Lea-Lafontaine",
    "city": "Beloeil",
    "province": "QC",
    "phone": "438-883-2607 or 438-887-2607"
  },
  {
    "firm": "Paris Ladouceur & Associates",
    "address": "63 rue de la pointe Langlois",
    "city": "Laval",
    "province": "QC",
    "phone": "(450) 963-2777  OR  514-385-4417"
  },
  {
    "firm": "PCG CARMON",
    "address": "1350 Mazurette Bureau 207",
    "city": "Montreal",
    "province": "QC",
    "phone": "514-365-6664"
  },
  {
    "firm": "PCG CARMON (Laval & St. Jerome Office)",
    "address": "5305, rue Notre-Dame, bureau 207",
    "city": "Laval / St. Jerome",
    "province": "QC",
    "phone": "514-365-6664"
  },
  {
    "firm": "Remy Auclair (Val D'or)",
    "address": "983, 2E Avenue",
    "city": "Val-d'Or",
    "province": "QC",
    "phone": "819-825-4777"
  },
  {
    "firm": "Robert Lapointe, EA",
    "address": "983 Rue Valiquette",
    "city": "Sainte-Ad\u00e8le",
    "province": "QC",
    "phone": "450-229-6693"
  },
  {
    "firm": "S. Blais & Associes",
    "address": "1400 Rue St-Louis Bureau 01-001",
    "city": "Gatineau",
    "province": "QC",
    "phone": "819-778-0300"
  },
  {
    "firm": "Sylvestre, Leblond & Associ\u00e9s (Granby)",
    "address": "50 Rue du Centre",
    "city": "Granby",
    "province": "QC",
    "phone": "450-777-3478"
  },
  {
    "firm": "Sylvestre, Leblond & Associes (St-Hyacinthe)",
    "address": "888 Bourdages Nord",
    "city": "St-Hyacinthe",
    "province": "QC",
    "phone": "450-773-5897"
  },
  {
    "firm": "Trudell,Montcalm & Associes",
    "address": "70 rue O'Keefe # 201",
    "city": "Valleyfield",
    "province": "QC",
    "phone": "450-377-3879"
  },
  {
    "firm": "Valuation of Estrie Inc.",
    "address": "3 Carre Des Loyalistes",
    "city": "Bromont",
    "province": "QC",
    "phone": "438-837-7019"
  },
  {
    "firm": "Vincent Ladouceur Evaluateur Immobilier Inc",
    "address": "63, rue de la Pointe Langlois",
    "city": "Laval",
    "province": "QC",
    "phone": "450-963-2777"
  },
  {
    "firm": "Yvon Poulin & Associes Inc",
    "address": "2035, du Haut-Bord, bureau 315",
    "city": "Quebec City",
    "province": "QC",
    "phone": "418-683-2929"
  },
  {
    "firm": "Associated Appraisal Company",
    "address": "3 \u2013 320 5th Avenue North",
    "city": "Saskatoon",
    "province": "SK",
    "phone": "306-934-2444"
  },
  {
    "firm": "B.R. Gaffney & Associates",
    "address": "200-2330 15th Avenue",
    "city": "Regina",
    "province": "SK",
    "phone": "306-359-7800,  306-527-3793,  306-359-7800 x227"
  },
  {
    "firm": "Blue Zephyr Ltd",
    "address": "",
    "city": "Saskatoon",
    "province": "SK",
    "phone": "306-380-5424"
  },
  {
    "firm": "Blyth Agencies",
    "address": "613 Lalonde St",
    "city": "Whitewood",
    "province": "SK",
    "phone": "306-735-2266"
  },
  {
    "firm": "CDC Consulting Services Inc. - SK",
    "address": "2010-11th Avenue, 7th Floor",
    "city": "Regina",
    "province": "SK",
    "phone": "1-866-479-7922"
  },
  {
    "firm": "Craig E Hellings Appraisals",
    "address": "170 Fairford St West",
    "city": "Moose Jaw",
    "province": "SK",
    "phone": "306-694-0777  OR 306-690-4579"
  },
  {
    "firm": "Cross Appraisals Inc. (Brunsdon Lawrek & Associates)",
    "address": "#301 20th Street West",
    "city": "Saskatoon",
    "province": "SK",
    "phone": "306-535-6376"
  },
  {
    "firm": "Crown Appraisals",
    "address": "2350 - 2nd Avenue",
    "city": "Regina",
    "province": "SK",
    "phone": "306-359-3111"
  },
  {
    "firm": "Dream Home Appraisal Co.",
    "address": "1308 8th Street East",
    "city": "Saskatoon",
    "province": "SK",
    "phone": "306-934-4455 or 306-227-1122"
  },
  {
    "firm": "Fortier Mattila Appraisals Inc.",
    "address": "461-16th Street W",
    "city": "Battleford",
    "province": "SK",
    "phone": "306-937-5073"
  },
  {
    "firm": "Fox Appraisals and Verra Group Consultants",
    "address": "8203 Kestral Drive",
    "city": "Regina",
    "province": "SK",
    "phone": "306-545-5200"
  },
  {
    "firm": "Gerein Appraisals",
    "address": "Box 20032",
    "city": "Yorkton",
    "province": "SK",
    "phone": "306-782-1765"
  },
  {
    "firm": "Gordon Lawson Real Estate Appraisals & Consulting",
    "address": "505 Guelph Crescent",
    "city": "Saskatoon",
    "province": "SK",
    "phone": "306-260-6007"
  },
  {
    "firm": "Just North of Appraisals",
    "address": "66 11 Street West",
    "city": "Prince Albert",
    "province": "SK",
    "phone": "306-862-8875  OR  306-764-5627  OR  306-764-1858"
  },
  {
    "firm": "Kamsol Elite Consultants Inc.",
    "address": "402 Broadway Ave East",
    "city": "Regina",
    "province": "SK",
    "phone": "306-807-1133  OR  604-366-1991"
  },
  {
    "firm": "Kaufmann Appraisals",
    "address": "1 Bow Court",
    "city": "Saskatoon",
    "province": "SK",
    "phone": "306-717-4231  or  306-227-3251"
  },
  {
    "firm": "McInnes & Company Appraisals",
    "address": "Suite 201, 5303-50 Avenue",
    "city": "Lloydminster",
    "province": "SK",
    "phone": "306-825-3500"
  },
  {
    "firm": "Michael Fox Valuations Inc",
    "address": "7531 Hearne Bay",
    "city": "Regina",
    "province": "SK",
    "phone": "306-775-3900"
  },
  {
    "firm": "Myrah Appraisals",
    "address": "2268 Harvey St.",
    "city": "Regina",
    "province": "SK",
    "phone": "306-359-1625  OR  306-591-0711"
  },
  {
    "firm": "Pinnacle Appraisals (now associated with Brunsdon Lawrek & Associates)",
    "address": "2454 Garnet St",
    "city": "Regina",
    "province": "SK",
    "phone": "306-737-3160"
  },
  {
    "firm": "Precision Appraisal Services",
    "address": "113 Burrows Ave W",
    "city": "Melfort",
    "province": "SK",
    "phone": "306-752-4331"
  },
  {
    "firm": "Reynolds Real Estate Appraisals",
    "address": "2126 Rose St",
    "city": "Regina",
    "province": "SK",
    "phone": "306-581-9994"
  },
  {
    "firm": "Ring Appraisals Ltd",
    "address": "140 - 12th St, E",
    "city": "Prince Albert",
    "province": "SK",
    "phone": "306-922-8484"
  },
  {
    "firm": "Riverside Appraisals Ltd.",
    "address": "1325 Spadina Crescent East",
    "city": "Saskatoon",
    "province": "SK",
    "phone": "306-227-6150  OR    306-652-6636"
  },
  {
    "firm": "Rolling Thunder Enterprises",
    "address": "Box 1858",
    "city": "Unity",
    "province": "SK",
    "phone": "306-228-3477"
  },
  {
    "firm": "Suncorp Valuations Ltd",
    "address": "300 - 261 1st Avenue North",
    "city": "Saskatoon",
    "province": "SK",
    "phone": "306-652-0311"
  },
  {
    "firm": "SUTY Consulting Inc",
    "address": "52 Goldenglow Drive",
    "city": "Moose Jaw",
    "province": "SK",
    "phone": "306-690-2669"
  },
  {
    "firm": "Tri-J Appraisals",
    "address": "1222 2nd St.",
    "city": "Estevan",
    "province": "SK",
    "phone": "306-634-4963"
  },
  {
    "firm": "United Appraisals",
    "address": "48 Longpre Crescent",
    "city": "Prince Albert",
    "province": "SK",
    "phone": "306-764-3435"
  },
  {
    "firm": "Warkentin Appraisal Services",
    "address": "1706 Springs Drive",
    "city": "Swift Current",
    "province": "SK",
    "phone": "306-778-3231"
  },
  {
    "firm": "Western Appraisals",
    "address": "1652-100th Street",
    "city": "North Battleford  SK,",
    "province": "SK",
    "phone": "306-445-7248"
  }
];

export const RFA_APPROVED_APPRAISERS: DirectoryAppraiserItem[] = [
  {
    "firm": "A.R.C. Appraisals LTD   Lethbridge",
    "phone": "403.388.4582",
    "city": "Lethbridge",
    "province": "AB"
  },
  {
    "firm": "A.S. Appraisals & Consulting",
    "phone": "780.842.9200",
    "city": "Wainwright",
    "province": "AB"
  },
  {
    "firm": "Appraisal Solutions Inc",
    "phone": "403.382.8004",
    "city": "Lethbridge",
    "province": "AB"
  },
  {
    "firm": "Atlas Appraisal Services",
    "phone": "780.874.0404",
    "city": "Lloydminster  Vegreville",
    "province": "AB"
  },
  {
    "firm": "Advantage Valuation Group Inc.",
    "phone": "403.830.6501",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Alberta Property Appraisals Ltd.",
    "phone": "780.453.1736",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "All Property Appraisals Ltd",
    "phone": "403.527.7199",
    "city": "Medicine Hat",
    "province": "AB"
  },
  {
    "firm": "Angus MacInnes Appraisals",
    "phone": "780.455.0777",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Apex Appraisal Service Ltd.   BC",
    "phone": "403.762.2072",
    "city": "Banff",
    "province": "AB"
  },
  {
    "firm": "Bedrock Appraisals",
    "phone": "403.823.0671",
    "city": "Delia",
    "province": "AB"
  },
  {
    "firm": "Benchmark Real Estate Appraisals Ltd.",
    "phone": "403.547.6434",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "By George Appraisal",
    "phone": "780.717.6801",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Bulbeck Appraisal Ltd.",
    "phone": "403.823.7808",
    "city": "Drumheller",
    "province": "AB"
  },
  {
    "firm": "Calgary Independent Appraisals",
    "phone": "403.543.5900",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "CAMA Real Estate Appraisals Ltd",
    "phone": "403.986.8110",
    "city": "Sylvan",
    "province": "AB"
  },
  {
    "firm": "Capital Region Real Estate Consulting Ltd.",
    "phone": "780.920.2170",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Cartwright Appraisals",
    "phone": "780.439.9650",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Cityline Appraisals Inc",
    "phone": "780.757.6240",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Darmac Appraisals Ltd",
    "phone": "780.875.1917",
    "city": "Lloydminster",
    "province": "AB"
  },
  {
    "firm": "DCR Appraisal",
    "phone": "403.427 0804",
    "city": "Brooks",
    "province": "AB"
  },
  {
    "firm": "Elite Appraisals",
    "phone": "403.714.1857",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "EM Johnson Appraisals",
    "phone": "403 844.3844",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Ergil, Bains & Assoicates Ltd",
    "phone": "780.486.5377",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Fletcher's Appraisal Services",
    "phone": "780.497.0680",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Grenkie Appraisals & Real Estate",
    "phone": "403.277.1442",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Halvorsen Fedynak & Company",
    "phone": "780.483.5250",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "J & E Appraisal Services",
    "phone": "403.252.4019",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Kennedy Appraisals Ltd",
    "phone": "780.903.7809",
    "city": "Beaumont",
    "province": "AB"
  },
  {
    "firm": "Kerrigan & Company",
    "phone": "780.743.8670",
    "city": "Fort McMurray",
    "province": "AB"
  },
  {
    "firm": "Landucation Consulting Ltd",
    "phone": "780 675.5559",
    "city": "Island Lake",
    "province": "AB"
  },
  {
    "firm": "Market Driven Appraisals",
    "phone": "403.625.9234",
    "city": "Claresholm",
    "province": "AB"
  },
  {
    "firm": "Market Value Appraisals Inc.",
    "phone": "780.933.5913",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "firm": "New Market Appraisals Ltd.",
    "phone": "403.201.1653",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Perry Appraisal Associates",
    "phone": "403.556.7277",
    "city": "Olds",
    "province": "AB"
  },
  {
    "firm": "PVG Real Estate Valutaions & Consulting",
    "phone": "780.532.1200",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "firm": "Raaziq Appraisals Ltd",
    "phone": "587.894.2658",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Roy Somers Appraisals",
    "phone": "780.835.0083",
    "city": "Worsley",
    "province": "AB"
  },
  {
    "firm": "Simmerson Appraisal Services",
    "phone": "403.227.1393",
    "city": "Innisfail",
    "province": "AB"
  },
  {
    "firm": "Slavik McCartney Appraisals Inc.",
    "phone": "780.723.7471",
    "city": "Edson",
    "province": "AB"
  },
  {
    "firm": "Squair Appraisals & Consulting",
    "phone": "780.995.6354",
    "city": "Clyde",
    "province": "AB"
  },
  {
    "firm": "Stone Appraisals",
    "phone": "780.618.8408",
    "city": "Manning",
    "province": "AB"
  },
  {
    "firm": "Weidman Reliance Group Inc",
    "phone": "403.815.2084",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Wildrose Appraisals",
    "phone": "403.559.8200",
    "city": "Sundre",
    "province": "AB"
  },
  {
    "firm": "Accord Appraisal Company",
    "phone": "780.679.0303",
    "city": "Camrose",
    "province": "AB"
  },
  {
    "firm": "Appraisal Management Group",
    "phone": "403.216.6803",
    "city": "Brentwood",
    "province": "AB"
  },
  {
    "firm": "Atkinson & Associates",
    "phone": "403.212.1103",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Biegel & Perra Appraisals",
    "phone": "780.814.6123",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "firm": "Blackmud Appraisals",
    "phone": "780.965.8972",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Howard & Company Inc",
    "phone": "403.343.7000",
    "city": "Red Deer",
    "province": "AB"
  },
  {
    "firm": "Jackson Real Estate Appraisals Ltd",
    "phone": "780.486.5158",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Kerrigan Appraisals",
    "phone": "780.743.8670",
    "city": "Fort McMurray",
    "province": "AB"
  },
  {
    "firm": "Knight & Company",
    "phone": "780.486.9545",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Kunsman Appraisal",
    "phone": "403.380.0541",
    "city": "Lethbridge",
    "province": "AB"
  },
  {
    "firm": "Lethbridge Property",
    "phone": "403.329.9000",
    "city": "Lethbridge",
    "province": "AB"
  },
  {
    "firm": "AVSN Valuation",
    "phone": "403.228.4001 ex 203",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "M.I.T. Appraisals Ltd.",
    "phone": "780.875.3500",
    "city": "Lloydminster",
    "province": "AB"
  },
  {
    "firm": "Sage Appraisals",
    "phone": "403.282.3322",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "McCartney Radench Appraisals Inc",
    "phone": "780.723.7471",
    "city": "Edson",
    "province": "AB"
  },
  {
    "firm": "Soderquist Appraisals",
    "phone": "403.346.5533",
    "city": "Red Deer",
    "province": "AB"
  },
  {
    "firm": "T.R. Moore & Associates",
    "phone": "403.271.7338",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Tru Appraisals Ltd.",
    "phone": "403.362.6992",
    "city": "Brooks",
    "province": "AB"
  },
  {
    "firm": "Val Appraisals",
    "phone": "780.826.2719",
    "city": "Bonnyville",
    "province": "AB"
  },
  {
    "firm": "Wainwright Assessment Group",
    "phone": "780.842.5002",
    "city": "Wainwright",
    "province": "AB"
  },
  {
    "firm": "Mackie Valuations Inc.",
    "phone": "403.887.8743",
    "city": "Sylvan Lake",
    "province": "AB"
  },
  {
    "firm": "Zindler & Associates",
    "phone": "403.258.1378",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Abbot Brown Appraisals",
    "phone": "780.830.7354",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "firm": "Bourgeois & Company",
    "phone": "780.452.8000",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "BraeMar Valuation Services",
    "phone": "403.342.6068",
    "city": "Red Deer",
    "province": "AB"
  },
  {
    "firm": "Calgary Residential Appraisals",
    "phone": "403.726.2369",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "CDC Consulting Inc. Curtis Cossey",
    "phone": "647.637.6776",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Cenalta Appraisals Ltd",
    "phone": "403.341.6405",
    "city": "Red Deer",
    "province": "AB"
  },
  {
    "firm": "Chalifour Denis & Associates",
    "phone": "780.743.1331",
    "city": "Fort McMurray",
    "province": "AB"
  },
  {
    "firm": "Charles Rannells Appraisals Inc",
    "phone": "780.483.4599",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "City Appraisals Ltd",
    "phone": "403.529.6200",
    "city": "Medicine Hat",
    "province": "AB"
  },
  {
    "firm": "Classic Appraisals",
    "phone": "403.529.2127",
    "city": "Medicine Hat",
    "province": "AB"
  },
  {
    "firm": "Dundas Appraisals Ltd.",
    "phone": "780.945.6565",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Eagleson Ho & Associates",
    "phone": "403.860.3334",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Essex Appraisal Group",
    "phone": "780.488.4116",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Frost & Associates",
    "phone": "780.462.1782",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Great West Appraisals Inc.",
    "phone": "888.771.4571",
    "city": "Canmore",
    "province": "AB"
  },
  {
    "firm": "Hagan Appraisal Services",
    "phone": "780.451.0022",
    "city": "Parkland County",
    "province": "AB"
  },
  {
    "firm": "Meehan Appraisal Services",
    "phone": "403.263.9666",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Mike LeClaire Appraisals Ltd",
    "phone": "780.940.8490",
    "city": "Tofield",
    "province": "AB"
  },
  {
    "firm": "Price Aspinall Appraisals Ltd",
    "phone": "403.283.0197",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Quinn & Company Appraisals Ltd",
    "phone": "780.370.4488",
    "city": "Fort McMurray",
    "province": "AB"
  },
  {
    "firm": "Real Tech Group Inc",
    "phone": "403.253.8855",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Reliance Appraisals",
    "phone": "403 328.9351",
    "city": "Lethbridge",
    "province": "AB"
  },
  {
    "firm": "S.D. Taylor & Company Ltd.",
    "phone": "403.519.9363",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Ergil Bains & Associates Ltd",
    "phone": "780.486.5377",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Accupro Real Estate Appraisal & Consulting",
    "phone": "780.538.9776",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "firm": "Pomeroy Valuation Group Ltd.",
    "phone": "780.532.1200",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "firm": "Cornerstone Appraisals Inc",
    "phone": "403.313.8502",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Harrison Bowker Real Estate Appraisers Ltd.",
    "phone": "780.458.3814",
    "city": "St. Albert",
    "province": "AB"
  },
  {
    "firm": "Hubbs R.E. Appraisals formerly Grenkie Appraisal",
    "phone": "403.277.1442",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "A.R.C. Appraisals LTD   Medicine Hat",
    "phone": "403.527.2737",
    "city": "Medicine Hat",
    "province": "AB"
  },
  {
    "firm": "D.G. Schultz and Associates",
    "phone": "780.466.5445",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Kate Rung & Associates",
    "phone": "403.556.8758",
    "city": "Olds",
    "province": "AB"
  },
  {
    "firm": "BNN Appraisals",
    "phone": "403.703.4002",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Sullivan Realty",
    "phone": "780.870.4880",
    "city": "Provost",
    "province": "AB"
  },
  {
    "firm": "Hill Appraisals Inc.",
    "phone": "403.978.5574",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Accumark Appraisals",
    "phone": "403.678.1748",
    "city": "Canmore",
    "province": "AB"
  },
  {
    "firm": "Northern Lights Real Estate Appraisals",
    "phone": "780.757.2060",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Landucation Valuation & Advisory Services",
    "phone": "780.675.5559",
    "city": "Athabasca",
    "province": "AB"
  },
  {
    "firm": "Black Valuation Group Ltd",
    "phone": "403.945.1652",
    "city": "Airdrie",
    "province": "AB"
  },
  {
    "firm": "Valera Consulting Inc.",
    "phone": "403.969.6653",
    "city": "Airdrie",
    "province": "AB"
  },
  {
    "firm": "Myers Appraisals",
    "phone": "403.869.8578",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Outlook Realty Advisors Inc",
    "phone": "403.870.5276",
    "city": "8Calgary",
    "province": "AB"
  },
  {
    "firm": "Bettenson Appraisals Spencer L Bettenson",
    "phone": "780.505.1920",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "firm": "TruePoint Appraisals Ltd",
    "phone": "403.341.0011",
    "city": "Red Deer County",
    "province": "AB"
  },
  {
    "firm": "Red Deer Appraisals Ltd",
    "phone": "403.350.8438",
    "city": "Red Deer",
    "province": "AB"
  },
  {
    "firm": "Steckler Real Estate Appraisals",
    "phone": "403.392.2547",
    "city": "Sylvan Lake",
    "province": "AB"
  },
  {
    "firm": "City Wide Residential Appraisals",
    "phone": "403.870.8555",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "True Value Appraisals Inc",
    "phone": "403.852.0427",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Tier One Appraisals Ltd",
    "phone": "780.483.5275",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "firm": "Lawrenson Walker Real Estate Appraisers Calgary",
    "phone": "587.291.9661",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "firm": "Vista Appraisal Group",
    "phone": "403.337.2778",
    "city": "Carstairs",
    "province": "AB"
  },
  {
    "firm": "Stettler Appraisals",
    "phone": "587.282.0822",
    "city": "Stettler",
    "province": "AB"
  },
  {
    "firm": "Bruce Anderson Appraisals",
    "phone": "780.962.6495",
    "city": "Spruce Grove",
    "province": "AB"
  },
  {
    "firm": "Balance Valuations",
    "phone": "780.532.9788",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "firm": "Aedis Appraisals",
    "phone": "604.682.7585",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "firm": "Aedis Okanagan Services Inc.",
    "phone": "250.448.1896",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "firm": "Alpha Appraisals",
    "phone": "250.682.1430",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "firm": "Angelica Real Estate Advisory Services",
    "phone": "604.290.4875",
    "city": "Garibaldi Highlands",
    "province": "BC"
  },
  {
    "firm": "Appraisals North West",
    "phone": "250.635.0615",
    "city": "Terrace",
    "province": "BC"
  },
  {
    "firm": "Area Wide Appraisals Ltd",
    "phone": "250.868.2532",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "firm": "Cunningham & Rivard Appraisals",
    "phone": "250.287.9595",
    "city": "Campbell River",
    "province": "BC"
  },
  {
    "firm": "Elliott Appraisals",
    "phone": "604.313.7598",
    "city": "New Westminster",
    "province": "BC"
  },
  {
    "firm": "Farnsworth Appraisals Ltd.",
    "phone": "250.377.1395",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "firm": "Fast Appraisals",
    "phone": "604.351.8916",
    "city": "Delta",
    "province": "BC"
  },
  {
    "firm": "Fraserway Appraisal Ltd.",
    "phone": "604.850.5557",
    "city": "Abbotsford (edited) Abobotsford",
    "province": "BC"
  },
  {
    "firm": "Georgia Strait Appraisals",
    "phone": "604.319.0870",
    "city": "West Vancouver",
    "province": "BC"
  },
  {
    "firm": "GW Marken Appraisal Assoc.",
    "phone": "250.354.4600",
    "city": "Nelson",
    "province": "BC"
  },
  {
    "firm": "IKD Appraisal Services Lrd.",
    "phone": "800.883.3952",
    "city": "Nanoose Bay",
    "province": "BC"
  },
  {
    "firm": "J.K. Wheeldon Appraisals Ltd",
    "phone": "250.426.8211",
    "city": "Cranbrook",
    "province": "BC"
  },
  {
    "firm": "John VanWoerkom",
    "phone": "604.306.3790",
    "city": "Delta",
    "province": "BC"
  },
  {
    "firm": "Kirk Appraisals Ltd.",
    "phone": "604.501.3900",
    "city": "Delta",
    "province": "BC"
  },
  {
    "firm": "Kohlen & Company",
    "phone": "250.398.7207",
    "city": "Willims Lake",
    "province": "BC"
  },
  {
    "firm": "Kootenay Columbia Appraisals",
    "phone": "250.362.9696",
    "city": "Cranbrook",
    "province": "BC"
  },
  {
    "firm": "Kors & Associates",
    "phone": "250.920.5552",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "firm": "Linquist Real Estate Appraisal",
    "phone": "604.942.7209",
    "city": "Port Moody",
    "province": "BC"
  },
  {
    "firm": "Lower Mainland Appraisal Services",
    "phone": "604.618.5676",
    "city": "North Vancouver",
    "province": "BC"
  },
  {
    "firm": "McIntosh Appraisals & Consulting",
    "phone": "250.342.4444",
    "city": "Invermere",
    "province": "BC"
  },
  {
    "firm": "Meisterman Appraisals",
    "phone": "604.277.5223",
    "city": "Richmond",
    "province": "BC"
  },
  {
    "firm": "Nearhood Appraisal Services Ltd.",
    "phone": "250.785.3191",
    "city": "Fort St. John",
    "province": "BC"
  },
  {
    "firm": "North Cariboo Appraisals Ltd",
    "phone": "250.992.6386",
    "city": "Quesnel",
    "province": "BC"
  },
  {
    "firm": "Penny & Keenleyside Appraisals",
    "phone": "604.525.3441",
    "city": "New Westminster",
    "province": "BC"
  },
  {
    "firm": "Plant & Associates   AB",
    "phone": "250.782.2001",
    "city": "Dawson Creek",
    "province": "BC"
  },
  {
    "firm": "Princeton Appraisals",
    "phone": "250.499.2406",
    "city": "Keremeos",
    "province": "BC"
  },
  {
    "firm": "RMC Appraisals",
    "phone": "250.719.1858",
    "city": "Pouce Coupe",
    "province": "BC"
  },
  {
    "firm": "SCHENONI & ASSOCIATES INC.",
    "phone": "604.377.7334",
    "city": "Surrey",
    "province": "BC"
  },
  {
    "firm": "South Cariboo Appraisals Ltd",
    "phone": "250.395.1730",
    "city": "Mile House",
    "province": "BC"
  },
  {
    "firm": "South Okanagan Appraisals",
    "phone": "250.492.5833",
    "city": "Penticton",
    "province": "BC"
  },
  {
    "firm": "Steve Cullis Appraisals Ltd.",
    "phone": "250.635.5211",
    "city": "Terrace",
    "province": "BC"
  },
  {
    "firm": "TDC Realty Appraisers",
    "phone": "604.970.5215",
    "city": "White Rock",
    "province": "BC"
  },
  {
    "firm": "Westside Appraisals Inc.",
    "phone": "604.264.8004",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "firm": "A 1 Appraisals Ltd.",
    "phone": "250.861.8440",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "firm": "Baker & Osland Appraisals Ltd",
    "phone": "250.475.2221",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "firm": "Benson Appraisal",
    "phone": "250.753.9995",
    "city": "Nanaimo",
    "province": "BC"
  },
  {
    "firm": "Berchard Appraisal ServicesBC",
    "phone": "250.598.4140",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "firm": "Beswick Professional Appraisal",
    "phone": "250.656.5990",
    "city": "Sidney",
    "province": "BC"
  },
  {
    "firm": "C H Godrey Appraisals Ltd",
    "phone": "250.563.1208",
    "city": "Prince George",
    "province": "BC"
  },
  {
    "firm": "Campbell & Pound",
    "phone": "604.270.8885",
    "city": "Richmond",
    "province": "BC"
  },
  {
    "firm": "Central Island Appraisals",
    "phone": "250.619.1155",
    "city": "Nanaimo",
    "province": "BC"
  },
  {
    "firm": "Coast Appraisals",
    "phone": "250.388.9151",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "firm": "Coast Wide Appraisals",
    "phone": "604.886.9831",
    "city": "Gibsons",
    "province": "BC"
  },
  {
    "firm": "Corrie Appraisals Ltd",
    "phone": "778.489.4663",
    "city": "Salmon Arm",
    "province": "BC"
  },
  {
    "firm": "Cowichan Duncan Appraisal Services",
    "phone": "250.746.6920",
    "city": "Duncan",
    "province": "BC"
  },
  {
    "firm": "Creston Valley Appraisals",
    "phone": "250.428.3503",
    "city": "Creston",
    "province": "BC"
  },
  {
    "firm": "Cunningham & Rivard",
    "phone": "250.753.3428",
    "city": "Nanaimo",
    "province": "BC"
  },
  {
    "firm": "D Fritz Appraisals",
    "phone": "250.413.7319",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "firm": "Associated Appraisers   Campbell River",
    "phone": "250.202.0163",
    "city": "Campbell River",
    "province": "BC"
  },
  {
    "firm": "EJ Annau & Associates",
    "phone": "250.248.8114",
    "city": "Parksville",
    "province": "BC"
  },
  {
    "firm": "Finden Appraisals",
    "phone": "250.960.1133",
    "city": "Prince George",
    "province": "BC"
  },
  {
    "firm": "Flynn Mirtle Moran Appraisers",
    "phone": "250.374.7731",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "firm": "Fraser Valley Appraisals Ltd.",
    "phone": "604.792.2133",
    "city": "Chilliwack",
    "province": "BC"
  },
  {
    "firm": "Frilan Appraisals",
    "phone": "250.374.9941",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "firm": "Marken G W Appraisal Associates Inc",
    "phone": "250.304.4558",
    "city": "Castlegar",
    "province": "BC"
  },
  {
    "firm": "Gateway Appraisal & Consulting Group",
    "phone": "604.216.0830",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "firm": "Hooker Craig Lum Garnett real Estate Advisors Ltd.",
    "phone": "778.571.2321",
    "city": "Surrey",
    "province": "BC"
  },
  {
    "firm": "Hossack, Newby, Graham & Smith",
    "phone": "604.738.0109",
    "city": "North Vancouver",
    "province": "BC"
  },
  {
    "firm": "Inland Appraisers Ltd.",
    "phone": "250.493.6734",
    "city": "Penticton",
    "province": "BC"
  },
  {
    "firm": "Insite Appraisals",
    "phone": "250.426.3180",
    "city": "Cranbrook",
    "province": "BC"
  },
  {
    "firm": "Intercity Appraisals Ltd.",
    "phone": "604.944.3282",
    "city": "Port Coquitlam",
    "province": "BC"
  },
  {
    "firm": "Isle West Appraisals",
    "phone": "250.756.1779",
    "city": "Nanaimo",
    "province": "BC"
  },
  {
    "firm": "J K Wheeldon Appraisals Ltd",
    "phone": "250.420.2350",
    "city": "Cranbrook",
    "province": "BC"
  },
  {
    "firm": "Jenkins Real Estate Appraisal & Consulting",
    "phone": "250.888.2133",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "firm": "Keystone Appraisals Inc.",
    "phone": "250.368.6855",
    "city": "Trail",
    "province": "BC"
  },
  {
    "firm": "Kicking Horse Appraisals",
    "phone": "877.456.5548",
    "city": "Golden",
    "province": "BC"
  },
  {
    "firm": "Kohlen & Co",
    "phone": "250.398.7207",
    "city": "Williams Lake",
    "province": "BC"
  },
  {
    "firm": "Landquest Appraisals",
    "phone": "250.785.5700",
    "city": "Fort St. John",
    "province": "BC"
  },
  {
    "firm": "Lawrenson Walker Real Estate Appraisers",
    "phone": "604.535.1494",
    "city": "Surrey",
    "province": "BC"
  },
  {
    "firm": "Leemore & Associates",
    "phone": "604.944.7005",
    "city": "Coquitlam",
    "province": "BC"
  },
  {
    "firm": "Macintosh Appraisals",
    "phone": "604.522.3900",
    "city": "New Westminster",
    "province": "BC"
  },
  {
    "firm": "Magee Appraisals",
    "phone": "250.924.8812",
    "city": "Ladysmith",
    "province": "BC"
  },
  {
    "firm": "McDonald Appraisals Inc.",
    "phone": "250.785.4895",
    "city": "Fort St. John",
    "province": "BC"
  },
  {
    "firm": "Mills Appraisal Group Ltd.",
    "phone": "250.727.0222",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "firm": "Moetre Appraisal Services",
    "phone": "250.753.6216",
    "city": "Nanaimo",
    "province": "BC"
  },
  {
    "firm": "Okanagan Appraisals",
    "phone": "250.763.0346",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "firm": "Pacific West Appraisals",
    "phone": "604.328.2862",
    "city": "Port Coquitlam",
    "province": "BC"
  },
  {
    "firm": "Pat Conroy Appraisals",
    "phone": "250.426.8700",
    "city": "Cranbrook",
    "province": "BC"
  },
  {
    "firm": "PCAG Property Advisors",
    "phone": "250.723.5099",
    "city": "Port Alberni",
    "province": "BC"
  },
  {
    "firm": "Ponti Appraisals",
    "phone": "250.828.9906",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "firm": "Revelstoke Appraisals Ltd",
    "phone": "250.837.4116",
    "city": "Revelstoke",
    "province": "BC"
  },
  {
    "firm": "Rocky Mountain Appraisals",
    "phone": "250.489.4413  x2367",
    "city": "Cranbrook",
    "province": "BC"
  },
  {
    "firm": "Schoenne & Associates",
    "phone": "250.542.2222",
    "city": "Vernon",
    "province": "BC"
  },
  {
    "firm": "Schoenne Appraisals Ltd.",
    "phone": "250.492.5151",
    "city": "Penticton",
    "province": "BC"
  },
  {
    "firm": "Vancouver Island Appraisals Ltd",
    "phone": "250.753.4022",
    "city": "Nanaimo",
    "province": "BC"
  },
  {
    "firm": "Walton Appraisals Ltd",
    "phone": "604.892.2311",
    "city": "Squamish",
    "province": "BC"
  },
  {
    "firm": "Westech Appraisal Services Ltd",
    "phone": "604.986.2722",
    "city": "North Vancouver",
    "province": "BC"
  },
  {
    "firm": "William S Jackson & Associates",
    "phone": "250.338.7323",
    "city": "Courtenay",
    "province": "BC"
  },
  {
    "firm": "Zaikow Agencies",
    "phone": "604.485.7788",
    "city": "Powell River",
    "province": "BC"
  },
  {
    "firm": "Rivard & Associates",
    "phone": "250.545.3278",
    "city": "Vernon",
    "province": "BC"
  },
  {
    "firm": "Kutyn Property Appraisals",
    "phone": "250.890.3320",
    "city": "Comox",
    "province": "BC"
  },
  {
    "firm": "Fernie Appraisals Ltd",
    "phone": "250.423.4304",
    "city": "Fernie",
    "province": "BC"
  },
  {
    "firm": "Fortin Appraisals Ltd.",
    "phone": "604.858.7124",
    "city": "Chilliwack",
    "province": "BC"
  },
  {
    "firm": "D Nelson Appraisals",
    "phone": "250.906.3200",
    "city": "Prince George",
    "province": "BC"
  },
  {
    "firm": "Golden Ears Appraisals",
    "phone": "604.460.0883",
    "city": "Maple Ridge",
    "province": "BC"
  },
  {
    "firm": "Saran Appraisals & Consulting LTD",
    "phone": "604.579.0264",
    "city": "Surrey",
    "province": "BC"
  },
  {
    "firm": "Astro Appraisals",
    "phone": "250.748.3159",
    "city": "Duncan",
    "province": "BC"
  },
  {
    "firm": "Palmer Appraisal Ltd.",
    "phone": "250.388.9102",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "firm": "Precision Appraisal Group",
    "phone": "250.897.5046",
    "city": "Comox",
    "province": "BC"
  },
  {
    "firm": "Gobin Appraisals",
    "phone": "604.722.0100",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "firm": "Adlaw Appraisals Ltd.",
    "phone": "604.809.8506",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "firm": "Pollock Appraisers and Consultants Inc",
    "phone": "205.859.6752",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "firm": "A Teck Appraisals",
    "phone": "250.649.1111",
    "city": "Prince George",
    "province": "BC"
  },
  {
    "firm": "Wertz Appraisals",
    "phone": "250.847.5303",
    "city": "Smithers",
    "province": "BC"
  },
  {
    "firm": "Peter Ryks Property Services Ltd",
    "phone": "250.567.9158",
    "city": "Vanderhoof",
    "province": "BC"
  },
  {
    "firm": "Okanagan North Appraisal Services",
    "phone": "250.542.2669",
    "city": "Vernon",
    "province": "BC"
  },
  {
    "firm": "Michael Harley & Associates Inc",
    "phone": "250.470.7735",
    "city": "Lake Country",
    "province": "BC"
  },
  {
    "firm": "Crandall Appraisal Services",
    "phone": "250.537.4742",
    "city": "Saltspring Island",
    "province": "BC"
  },
  {
    "firm": "Nicam Appraisals Inc.",
    "phone": "778.476.5440",
    "city": "Penticton",
    "province": "BC"
  },
  {
    "firm": "Urban Valley Appraisals",
    "phone": "1.888.852.8087",
    "city": "Abbotsford",
    "province": "BC"
  },
  {
    "firm": "Thompson Rivers Appraisals & Real Estate",
    "phone": "250.372.2599",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "firm": "Kelowna Appraisals Ltd",
    "phone": "250.868.2933",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "firm": "Strand & Godfrey Appraisals Ltd.",
    "phone": "250.365.5161",
    "city": "Castlegar",
    "province": "BC"
  },
  {
    "firm": "All Equity Appraisals Ltd",
    "phone": "250.717.7509",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "firm": "Appraisal West",
    "phone": "250.861.3101",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "firm": "Summit Appraisal & Consulting Ltd",
    "phone": "250.921.5699",
    "city": "Trail",
    "province": "BC"
  },
  {
    "firm": "Viking Real Estate Inc",
    "phone": "250.862.0762",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "firm": "Cherrille Appraisals",
    "phone": "250.878.6401",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "firm": "Dedora Schoenne Appraisers",
    "phone": "250.542.2222",
    "city": "Vernon",
    "province": "BC"
  },
  {
    "firm": "Great West Appraisal Inc.",
    "phone": "",
    "city": "Golden",
    "province": "BC"
  },
  {
    "firm": "Okanagan North Appraisal Services 2015",
    "phone": "",
    "city": "Vernon",
    "province": "BC"
  },
  {
    "firm": "Schoenne Appraisals",
    "phone": "",
    "city": "Penticton",
    "province": "BC"
  },
  {
    "firm": "Thompson Rivers Appraisals & Real Estate Consultants Inc",
    "phone": "",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "firm": "Cunningham & Rivard Appraisals",
    "phone": "604.985.8761",
    "city": "North Vancouver",
    "province": "BC"
  },
  {
    "firm": "Holmes to Homes Real Property Appraisals Inc",
    "phone": "250.830.8369",
    "city": "Campbell River",
    "province": "BC"
  },
  {
    "firm": "Donna Michels Property Services Ltd",
    "phone": "250.567.4054",
    "city": "Vanderhoof",
    "province": "BC"
  },
  {
    "firm": "Island Pacific Appraisals",
    "phone": "250.619.2088",
    "city": "Nanaimo",
    "province": "BC"
  },
  {
    "firm": "CDC Inc",
    "phone": "866.479.7922",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "firm": "Gerritsen Brooks Ltd.",
    "phone": "250.465.8148",
    "city": "Courtenay",
    "province": "BC"
  },
  {
    "firm": "Quality Appraisals Inc",
    "phone": "250.832.3709",
    "city": "Revelstoke",
    "province": "BC"
  },
  {
    "firm": "A.L. McCoubrey & Associates",
    "phone": "204.261.9000",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Agassiz Appraisals Inc.",
    "phone": "204.362.3877",
    "city": "Winkler",
    "province": "MB"
  },
  {
    "firm": "Brad Carefoot",
    "phone": "204.622.2248",
    "city": "Dauphin",
    "province": "MB"
  },
  {
    "firm": "Burley Appraisal Associates",
    "phone": "204.801.0682",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "CL Appraisals",
    "phone": "204.724.0814",
    "city": "Brandon",
    "province": "MB"
  },
  {
    "firm": "C.W. Appraisals",
    "phone": "204.223.3475",
    "city": "Oak Bluff",
    "province": "MB"
  },
  {
    "firm": "David Park",
    "phone": "204.761.8000",
    "city": "Brandon",
    "province": "MB"
  },
  {
    "firm": "Dennis T. Browaty & Assoc",
    "phone": "204.942.7574",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Grantham Appraisal Services",
    "phone": "204.467.5295",
    "city": "Stonewall",
    "province": "MB"
  },
  {
    "firm": "Halladay Appraisal Services Ltd",
    "phone": "204.981.1390",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Herb Jaques",
    "phone": "204.623.2374",
    "city": "The Pas",
    "province": "MB"
  },
  {
    "firm": "Kemp Appraisals Ltd.",
    "phone": "204.791.1746",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "LS Appraisals & Consulting Services",
    "phone": "204.422.9765",
    "city": "Richer",
    "province": "MB"
  },
  {
    "firm": "MacKenzie & Associates",
    "phone": "204.837.7739",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Pearson Appraisals",
    "phone": "204.282.4000",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Sherrett Appraisals Inc.",
    "phone": "204.489.9011",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Tomchuk & Associates",
    "phone": "204.227.0919",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Tomiuk Grycko Krueger",
    "phone": "204.942.2121",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Absolute Appraisal Co",
    "phone": "204.573.6957",
    "city": "Brandon",
    "province": "MB"
  },
  {
    "firm": "Berchard Appraisal Services",
    "phone": "877.878.7559",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "CW Appraisals Inc",
    "phone": "204.223.3475",
    "city": "Howden",
    "province": "MB"
  },
  {
    "firm": "Hink Appraisals",
    "phone": "204.896.3979",
    "city": "Headingley",
    "province": "MB"
  },
  {
    "firm": "Lockers Real Estate Brokers",
    "phone": "204.677.1857",
    "city": "Thompson",
    "province": "MB"
  },
  {
    "firm": "Red River Appraisal Services",
    "phone": "855.371.5833",
    "city": "Niverville",
    "province": "MB"
  },
  {
    "firm": "Remax Thompson",
    "phone": "204.778.6303",
    "city": "Thompson",
    "province": "MB"
  },
  {
    "firm": "Rempel Wagner Dunn Real Estate Appraisers Ltd",
    "phone": "204.982.2890",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Royal LePage Martin Liberty",
    "phone": "204 725 8859",
    "city": "Brandon",
    "province": "MB"
  },
  {
    "firm": "Tomiuk & Grycko",
    "phone": "204.942.2121",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Booth Cowie Appraisals",
    "phone": "204.761.7285",
    "city": "Brandon",
    "province": "MB"
  },
  {
    "firm": "Booth & Co Appraisals",
    "phone": "204.717.1946",
    "city": "Brandon",
    "province": "MB"
  },
  {
    "firm": "Rixon Appraisal Services",
    "phone": "204.888.5566",
    "city": "Charleswood",
    "province": "MB"
  },
  {
    "firm": "The Appraisal Network",
    "phone": "204.995.4350",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Sigmar Mackenzie Real Estate Services Ltd",
    "phone": "204.952.1529",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Acclaimed Appraisal Group",
    "phone": "",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Valridge Realty",
    "phone": "",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "True North Appraisals",
    "phone": "204.230.9800",
    "city": "Steinbach",
    "province": "MB"
  },
  {
    "firm": "The Appraisal Firm",
    "phone": "204.952.1529",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Demonomics Inc",
    "phone": "403.461.5916",
    "city": "The Pas",
    "province": "MB"
  },
  {
    "firm": "CDC Inc",
    "phone": "866.479.7322",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "firm": "Absolute Appraisals",
    "phone": "506.479.4709",
    "city": "Drummond",
    "province": "NB"
  },
  {
    "firm": "Absolute Value Appraisals",
    "phone": "506.454.3499",
    "city": "Fredericton",
    "province": "NB"
  },
  {
    "firm": "Altus Group    Resurgo Appraisals Inc",
    "phone": "506.800.2140",
    "city": "Dieppe",
    "province": "NB"
  },
  {
    "firm": "DG Evaluation",
    "phone": "506.737.8484",
    "city": "Edmunston",
    "province": "NB"
  },
  {
    "firm": "Evaluations Anglehart Appraisals",
    "phone": "506.329.9000",
    "city": "Campbellton",
    "province": "NB"
  },
  {
    "firm": "Northeast Appraisals Ltd.",
    "phone": "506 544.9025",
    "city": "Bathurst",
    "province": "NB"
  },
  {
    "firm": "Perron Lynch & Associates",
    "phone": "506.778.2126",
    "city": "Miramichi",
    "province": "NB"
  },
  {
    "firm": "AES CONSULTANTS LTD.",
    "phone": "506.548.3363",
    "city": "Bathurst",
    "province": "NB"
  },
  {
    "firm": "Resurgo Appraisals Inc   Edwin O'donnell",
    "phone": "506.800.2140",
    "city": "Dieppe",
    "province": "NB"
  },
  {
    "firm": "Altus Helyar",
    "phone": "506.858.2787",
    "city": "Dieppe",
    "province": "NB"
  },
  {
    "firm": "Appraisals Fundy Ltd.",
    "phone": "506.634.1274",
    "city": "Saint John",
    "province": "NB"
  },
  {
    "firm": "De Stecher Appraisals Ltd",
    "phone": "506.634.8423",
    "city": "St John",
    "province": "NB"
  },
  {
    "firm": "Deryl A. Fitzgerald",
    "phone": "506.333.1311",
    "city": "Saint John",
    "province": "NB"
  },
  {
    "firm": "Evaluation 2000 Ltd",
    "phone": "506.735.5548",
    "city": "Edmundston",
    "province": "NB"
  },
  {
    "firm": "Evaluation Action Appraisals",
    "phone": "506.473.9111",
    "city": "Grand Falls",
    "province": "NB"
  },
  {
    "firm": "Evaluations Babineau Appraisals Ltd.",
    "phone": "506.856.8686",
    "city": "Moncton",
    "province": "NB"
  },
  {
    "firm": "Evaluations Perron Appraisals",
    "phone": "506.789.8854",
    "city": "Campbellton",
    "province": "NB"
  },
  {
    "firm": "Fredericton Appraisal Assoc.",
    "phone": "506.458.9533",
    "city": "Fredericton",
    "province": "NB"
  },
  {
    "firm": "G.A. Barry Appraisals Ltd.",
    "phone": "506.622.1617",
    "city": "Miramichi",
    "province": "NB"
  },
  {
    "firm": "Landing Appraisals Ltd   Susan Cummings",
    "phone": "506.662.8415",
    "city": "St.George",
    "province": "NB"
  },
  {
    "firm": "Mari-Tech Appraisals",
    "phone": "506.852.4184",
    "city": "Moncton",
    "province": "NB"
  },
  {
    "firm": "A & A Real Estate Appraisal Services",
    "phone": "506.458.5551",
    "city": "Fredericton",
    "province": "NB"
  },
  {
    "firm": "Anglehart Appraisals",
    "phone": "506.329.5627",
    "city": "Campbellton",
    "province": "NB"
  },
  {
    "firm": "Roxwood Appraisls",
    "phone": "506.457.1660",
    "city": "Fredericton",
    "province": "NB"
  },
  {
    "firm": "von Weiler Reid & Associates",
    "phone": "506.651.7663",
    "city": "Saint John",
    "province": "NB"
  },
  {
    "firm": "G.A. Barry Real Estate & Appraisals Ltd.",
    "phone": "",
    "city": "Miramichi",
    "province": "NB"
  },
  {
    "firm": "Leech Appraisals Ltd",
    "phone": "506.328.3120",
    "city": "Woodstock",
    "province": "NB"
  },
  {
    "firm": "Resurgo Appraisals Inc",
    "phone": "506.384.3957",
    "city": "Dieppe",
    "province": "NB"
  },
  {
    "firm": "Merrill Appraisals Ltd.",
    "phone": "506.260.3486",
    "city": "Blackville",
    "province": "NB"
  },
  {
    "firm": "Appraisal Affiliates Inc",
    "phone": "709.639.8949",
    "city": "Corner Brook",
    "province": "NL"
  },
  {
    "firm": "Appraisal Associates Gander Ltd.",
    "phone": "709.651.2491",
    "city": "Gander",
    "province": "NL"
  },
  {
    "firm": "Appraisal of Real Property ltd",
    "phone": "709.576.8290",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "firm": "Avalon Appraisals Ltd.",
    "phone": "709.596.1998",
    "city": "Hr. Grace",
    "province": "NL"
  },
  {
    "firm": "Brocklehurst & Company Limited",
    "phone": "709.753.2620",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "firm": "Central Appraisal Services",
    "phone": "709.632.1947",
    "city": "Corner Brook",
    "province": "NL"
  },
  {
    "firm": "Concept Appraisals",
    "phone": "709.466.7134",
    "city": "Clarenvillle",
    "province": "NL"
  },
  {
    "firm": "Elite Appraisals & Consulting",
    "phone": "709.632.2075",
    "city": "Corner Brook",
    "province": "NL"
  },
  {
    "firm": "J & T Appraisals Ltd.",
    "phone": "709.753.1579",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "firm": "MacDonald & Hoffe Appraisals Ltd",
    "phone": "709.635.5374",
    "city": "Deer Lake",
    "province": "NL"
  },
  {
    "firm": "RexNor Enterprise Ltd",
    "phone": "709 695.8656",
    "city": "Port aux Basques",
    "province": "NL"
  },
  {
    "firm": "SRW Appraisals",
    "phone": "709.643.2714",
    "city": "Stephenville",
    "province": "NL"
  },
  {
    "firm": "Young's Real Estate Appraisal",
    "phone": "709.635.3583",
    "city": "Deer Lake",
    "province": "NL"
  },
  {
    "firm": "Appraisal Associates Limited",
    "phone": "709.726.8757",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "firm": "Appraisal Services Ltd.",
    "phone": "709.726.3031",
    "city": "St John's",
    "province": "NL"
  },
  {
    "firm": "DEW Enterprises Ltd",
    "phone": "709.489.6895",
    "city": "Grand Falls Windsor",
    "province": "NL"
  },
  {
    "firm": "Drafting & Appraisal Services",
    "phone": "709.634.3017",
    "city": "Corner Brook",
    "province": "NL"
  },
  {
    "firm": "Hamilton Contracting Ltd.",
    "phone": "709.896.0565",
    "city": "Goose Bay",
    "province": "NL"
  },
  {
    "firm": "Household Realty Consulting Ltd",
    "phone": "709.747.3353",
    "city": "St John's",
    "province": "NL"
  },
  {
    "firm": "Kirkland Appraisals",
    "phone": "709.687.4840",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "firm": "Kirkland Balsom",
    "phone": "709.738.1000",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "firm": "Bay Roberts Appraisal Services",
    "phone": "709.786.6776",
    "city": "Coley's Point",
    "province": "NL"
  },
  {
    "firm": "RPS Appraisal Consultants Inc",
    "phone": "709.673.5795",
    "city": "Goose Bay",
    "province": "NL"
  },
  {
    "firm": "Prosser Appraisals",
    "phone": "709.466.1784",
    "city": "Clarenville",
    "province": "NL"
  },
  {
    "firm": "Appraisal Central Inc.",
    "phone": "709.486.6895",
    "city": "Grand Falls-Windsor",
    "province": "NL"
  },
  {
    "firm": "Abacus Residential Appraisls Inc.",
    "phone": "902.449.7215",
    "city": "Halifax",
    "province": "NS"
  },
  {
    "firm": "Allison Appraisals Limited",
    "phone": "902.476.3805",
    "city": "Enfield",
    "province": "NS"
  },
  {
    "firm": "Barkhouse Appraisals",
    "phone": "902.863.5987",
    "city": "Antigonish",
    "province": "NS"
  },
  {
    "firm": "Carmquin Property Appraisals",
    "phone": "902.681.5868",
    "city": "New Minas",
    "province": "NS"
  },
  {
    "firm": "Cobequid Appraisal",
    "phone": "902.895.4475",
    "city": "Truro",
    "province": "NS"
  },
  {
    "firm": "Cornerstone Home Appraisals",
    "phone": "902.665.5220",
    "city": "Annapolis Royal",
    "province": "NS"
  },
  {
    "firm": "East Coast Appraisals Ltd.",
    "phone": "902.678.9257",
    "city": "Coldbrook",
    "province": "NS"
  },
  {
    "firm": "G. Ratchford & Associates Inc",
    "phone": "902.565.8232",
    "city": "North Sydney",
    "province": "NS"
  },
  {
    "firm": "Highland Appraisals",
    "phone": "902.756.3403",
    "city": "Cape Breton",
    "province": "NS"
  },
  {
    "firm": "Jean Hicks Appraisals",
    "phone": "902.431.9050",
    "city": "Halifax",
    "province": "NS"
  },
  {
    "firm": "JF MacIvor Properties",
    "phone": "902.396.7653",
    "city": "New Glasgow",
    "province": "NS"
  },
  {
    "firm": "Joudrey Appraisals",
    "phone": "902.543.2659",
    "city": "Lunenburg County",
    "province": "NS"
  },
  {
    "firm": "Kennedy Appraisals",
    "phone": "902.849.9844",
    "city": "Glace Bay",
    "province": "NS"
  },
  {
    "firm": "Larry Matthews Appraisals",
    "phone": "902.639.1671",
    "city": "Shubenacadie",
    "province": "NS"
  },
  {
    "firm": "Mackey Appraisal Ltd.",
    "phone": "902.562.6112",
    "city": "Sydney",
    "province": "NS"
  },
  {
    "firm": "Malcolm S. Tizzard",
    "phone": "902.664.6699",
    "city": "Oxford",
    "province": "NS"
  },
  {
    "firm": "Nova West Valuations",
    "phone": "902.769.3273",
    "city": "Churchpoint",
    "province": "NS"
  },
  {
    "firm": "R & J Appraisals",
    "phone": "902.765.3323",
    "city": "Kingston",
    "province": "NS"
  },
  {
    "firm": "Remax Banner",
    "phone": "902.825.4679",
    "city": "Middleton",
    "province": "NS"
  },
  {
    "firm": "Robert Wambolt Appraisals",
    "phone": "902.535.2786",
    "city": "St. Peter's",
    "province": "NS"
  },
  {
    "firm": "The MacKay Group Ltd.",
    "phone": "902.755.2858",
    "city": "New Glasgow",
    "province": "NS"
  },
  {
    "firm": "Watt Realty Appraisals",
    "phone": "902.662.3355",
    "city": "Truro",
    "province": "NS"
  },
  {
    "firm": "AKME Appraisals Inc.",
    "phone": "902.483.7321",
    "city": "Halifax",
    "province": "NS"
  },
  {
    "firm": "Alderney Real Estate Appraisals",
    "phone": "902.466.2000",
    "city": "Dartmouth",
    "province": "NS"
  },
  {
    "firm": "Boutilier & Associates",
    "phone": "902.435.2200",
    "city": "Dartmouth",
    "province": "NS"
  },
  {
    "firm": "Davidson Appraisals",
    "phone": "902.542.7001",
    "city": "Wolfville",
    "province": "NS"
  },
  {
    "firm": "Fennell & Associates Appraisers Ltd.",
    "phone": "902.453.5051",
    "city": "Halifax",
    "province": "NS"
  },
  {
    "firm": "Kempton Appraisals Ltd.",
    "phone": "902.543.3000",
    "city": "Bridgewater",
    "province": "NS"
  },
  {
    "firm": "MacKay Group Ltd",
    "phone": "902.755.2858",
    "city": "New Glasgow",
    "province": "NS"
  },
  {
    "firm": "McCharles Appraisals",
    "phone": "902.565.6315",
    "city": "Sydney",
    "province": "NS"
  },
  {
    "firm": "NJ Bell Appraisals",
    "phone": "902.396.4059",
    "city": "Westville",
    "province": "NS"
  },
  {
    "firm": "W. Black & Sons R.E. Ltd.",
    "phone": "902.794.4343",
    "city": "North Sydney",
    "province": "NS"
  },
  {
    "firm": "Weatherby Appraisals",
    "phone": "902.895.3065",
    "city": "Truro",
    "province": "NS"
  },
  {
    "firm": "Wetmore Corkum Appraisers",
    "phone": "902.679.1122",
    "city": "Kentville",
    "province": "NS"
  },
  {
    "firm": "ARA Atlantic Realty Advisors",
    "phone": "",
    "city": "B Bedford",
    "province": "NS"
  },
  {
    "firm": "Mari-Tech Appraisal & Inspection",
    "phone": "902.468.4183",
    "city": "Dartmouth",
    "province": "NS"
  },
  {
    "firm": "Antovic Real Property Appraisals",
    "phone": "902.441.4434",
    "city": "Dartmouth",
    "province": "NS"
  },
  {
    "firm": "Jacklyn Parker Appraisals",
    "phone": "902.798.2288",
    "city": "Maitland",
    "province": "NS"
  },
  {
    "firm": "Young & Associates",
    "phone": "902.531.2522",
    "city": "Bridgewater",
    "province": "NS"
  },
  {
    "firm": "Maison Property Appraisals",
    "phone": "902.431.9050",
    "city": "Halifax",
    "province": "NS"
  },
  {
    "firm": "D. Wooden Appraisals Ltd",
    "phone": "902.300.2750",
    "city": "Canaan",
    "province": "NS"
  },
  {
    "firm": "AK Appraisals Ltd",
    "phone": "647.994.8800",
    "city": "Richmond Hill",
    "province": "ON"
  },
  {
    "firm": "24 Appraisal Inc.",
    "phone": "800.275.6590",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "ACI Appraisal Company Inc",
    "phone": "416.932.2367",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Adele Kelly Appraisers",
    "phone": "613.735.3185",
    "city": "Pembroke",
    "province": "ON"
  },
  {
    "firm": "Advance Appraisals Inc.",
    "phone": "647.692.6662",
    "city": "Markham",
    "province": "ON"
  },
  {
    "firm": "Appraisals Completed Ltd.",
    "phone": "519.420.8755",
    "city": "Simcoe",
    "province": "ON"
  },
  {
    "firm": "Appraisal Connection",
    "phone": "905.762.8977",
    "city": "Thornhill",
    "province": "ON"
  },
  {
    "firm": "Appraisal One",
    "phone": "705.897.1296",
    "city": "Greater Sudbury",
    "province": "ON"
  },
  {
    "firm": "Appraisals by C & G Inc",
    "phone": "705.522.7213",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "firm": "Appraisals North Realty Inc.",
    "phone": "705.688.9300",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "firm": "Associated Realty Consultants 2000 Inc.",
    "phone": "519.273.6026",
    "city": "Stratford",
    "province": "ON"
  },
  {
    "firm": "Austin & Austin Realty",
    "phone": "807.223.6215",
    "city": "Dryden",
    "province": "ON"
  },
  {
    "firm": "B C Appraisals Inc.",
    "phone": "519.426.3388",
    "city": "Simcoe",
    "province": "ON"
  },
  {
    "firm": "Baayen & Associates",
    "phone": "905.373.6990",
    "city": "Cobourg",
    "province": "ON"
  },
  {
    "firm": "Barrons Real Estate Appraisals",
    "phone": "519.542.1533",
    "city": "Sarnia",
    "province": "ON"
  },
  {
    "firm": "Sotheby's international",
    "phone": "1.705.375.2333",
    "city": "Mactier",
    "province": "ON"
  },
  {
    "firm": "Bob Jugovic Real Estate Ltd",
    "phone": "905.515.5765",
    "city": "North Hamilton",
    "province": "ON"
  },
  {
    "firm": "C. M. Bradshaw & Associates",
    "phone": "613.968.9919",
    "city": "Foxboro",
    "province": "ON"
  },
  {
    "firm": "Charles Bell Real Estate Appraisals",
    "phone": "705.671.2355",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "firm": "Chris Dopko Appraisal Services",
    "phone": "905.516.8584",
    "city": "Stoney Creek",
    "province": "ON"
  },
  {
    "firm": "Clay Property Appraisals",
    "phone": "705.946.4984",
    "city": "Sault Ste Marie",
    "province": "ON"
  },
  {
    "firm": "Coulson Appraisals Ltd",
    "phone": "905.878.4128",
    "city": "Milton",
    "province": "ON"
  },
  {
    "firm": "Creditview Appraisals",
    "phone": "416.402.5744",
    "city": "Brampton",
    "province": "ON"
  },
  {
    "firm": "Danford Appraisals",
    "phone": "705.734.2895",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "firm": "Diane Stoodley Real Estate",
    "phone": "800.363.5476",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "firm": "DK Appraisals",
    "phone": "647.893.1311",
    "city": "Brampton",
    "province": "ON"
  },
  {
    "firm": "EM Hick Appraisals",
    "phone": "705.653.7230",
    "city": "Campbellford",
    "province": "ON"
  },
  {
    "firm": "Ernie McElrea CRA",
    "phone": "705.328.1399",
    "city": "Lindsay",
    "province": "ON"
  },
  {
    "firm": "ES Gorski Realty Ltd",
    "phone": "519.966.9940",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "firm": "F K Mitchell Appraisals Inc.",
    "phone": "519.966.9613",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "firm": "F.G. Myatt Appraisal Services",
    "phone": "613.354.3550",
    "city": "Greater Napanee",
    "province": "ON"
  },
  {
    "firm": "Gagner & Associates Excel Realty Services",
    "phone": "519.436.6161",
    "city": "Chatham Kent",
    "province": "ON"
  },
  {
    "firm": "Genesis Appraisals",
    "phone": "647.985.0025",
    "city": "Markham",
    "province": "ON"
  },
  {
    "firm": "Gifford Appraisals",
    "phone": "905.683.2637",
    "city": "Pickering",
    "province": "ON"
  },
  {
    "firm": "Grand River Real Estate Appraisals",
    "phone": "226.444.6119",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "firm": "Brighton Appraisals",
    "phone": "519 364.0694",
    "city": "Hanover",
    "province": "ON"
  },
  {
    "firm": "Harbourview Property Services",
    "phone": "905 5773003",
    "city": "Dundas",
    "province": "ON"
  },
  {
    "firm": "Harvey Dawe Realty Ltd.",
    "phone": "705.324.9488",
    "city": "Lindsay",
    "province": "ON"
  },
  {
    "firm": "Hugh R Fay & Associates",
    "phone": "519.978.0551",
    "city": "LaSalle",
    "province": "ON"
  },
  {
    "firm": "Hutchesson Appraisals",
    "phone": "705.352.1777",
    "city": "Wasaga Beach",
    "province": "ON"
  },
  {
    "firm": "Hutton Appraisal Service",
    "phone": "705.645.2468",
    "city": "Bracebridge",
    "province": "ON"
  },
  {
    "firm": "Rivington Associates Inc.",
    "phone": "613.267.6800 x225",
    "city": "West Perth",
    "province": "ON"
  },
  {
    "firm": "J. Swan Appraisals",
    "phone": "705.526.2200",
    "city": "Perkinsfield",
    "province": "ON"
  },
  {
    "firm": "JD Appraisal Associates",
    "phone": "705.349.2098",
    "city": "Burks Falls",
    "province": "ON"
  },
  {
    "firm": "John A. Shamess Appraisals",
    "phone": "705.848.6132",
    "city": "Elliot Lake",
    "province": "ON"
  },
  {
    "firm": "John F. Gebal Real Estate Services",
    "phone": "519.354.1900",
    "city": "Chatham",
    "province": "ON"
  },
  {
    "firm": "K Baker Property Appraisals",
    "phone": "519.265.2575",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "firm": "K. Downe Residential Appraisals",
    "phone": "519.763.9191",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "firm": "K.J. Stub & Associates",
    "phone": "519.433.2255",
    "city": "London",
    "province": "ON"
  },
  {
    "firm": "Keller Williams Ottawa Realty",
    "phone": "613 236.5959",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "Ken Leffler Appraisal Services Inc",
    "phone": "705.356.1416",
    "city": "Blind River",
    "province": "ON"
  },
  {
    "firm": "Kitchen & Company",
    "phone": "705.645.2991",
    "city": "Bracebridge",
    "province": "ON"
  },
  {
    "firm": "L.A. Mirotta & Company",
    "phone": "519.242.4172",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "firm": "Lack Realty Appr & Cons Inc.",
    "phone": "905.579.7942",
    "city": "North Oshawa",
    "province": "ON"
  },
  {
    "firm": "Lakeland Appraisals",
    "phone": "705.783.0808",
    "city": "Huntsville",
    "province": "ON"
  },
  {
    "firm": "Landry's for Real Estate",
    "phone": "807.468.9871",
    "city": "Kenora",
    "province": "ON"
  },
  {
    "firm": "Laser Appraiser",
    "phone": "905.659.0758",
    "city": "Dundas",
    "province": "ON"
  },
  {
    "firm": "Latitude 50 Realty",
    "phone": "807.223.4950",
    "city": "Dryden",
    "province": "ON"
  },
  {
    "firm": "Leander Property Appraisals Inc.",
    "phone": "905.841.1841",
    "city": "",
    "province": "ON"
  },
  {
    "firm": "Lenc Appraisals",
    "phone": "613.756.0593",
    "city": "Barry's Bay",
    "province": "ON"
  },
  {
    "firm": "Leslie T. Weatherby Realty",
    "phone": "613.542.4935",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "firm": "Locc Real Estate & Appraisals",
    "phone": "519.344.5622",
    "city": "Sarnia",
    "province": "ON"
  },
  {
    "firm": "MF Appraisals",
    "phone": "",
    "city": "Val Therese",
    "province": "ON"
  },
  {
    "firm": "Mid   North Appraisals Ltd.",
    "phone": "705.724.6348",
    "city": "Powassan",
    "province": "ON"
  },
  {
    "firm": "Mississippi Appraisal Services",
    "phone": "613.880.8859",
    "city": "Carlton Place",
    "province": "ON"
  },
  {
    "firm": "Ottawa Carlton Appraisal",
    "phone": "613.592.7977",
    "city": "Kanata",
    "province": "ON"
  },
  {
    "firm": "PAC Appraisal Inc",
    "phone": "905.281.3220",
    "city": "Mississauga",
    "province": "ON"
  },
  {
    "firm": "Patrol Property Services",
    "phone": "519.683.2526",
    "city": "Wallaceburg",
    "province": "ON"
  },
  {
    "firm": "Boot Appraisal Services",
    "phone": "705.740.2668",
    "city": "Peterborough",
    "province": "ON"
  },
  {
    "firm": "Pinpoint Appraisals Inc",
    "phone": "613.279.9303",
    "city": "Sharbot Lake",
    "province": "ON"
  },
  {
    "firm": "Professional Appraisal Associate",
    "phone": "519.639.3087",
    "city": "London",
    "province": "ON"
  },
  {
    "firm": "Property Valuators Consulting Inc  PVCI Inc.",
    "phone": "905.623.6023",
    "city": "Bowmanville",
    "province": "ON"
  },
  {
    "firm": "R.A. Critchlow  Realty",
    "phone": "519.326.6154",
    "city": "Leamington",
    "province": "ON"
  },
  {
    "firm": "Richard Cruji Appraisals",
    "phone": "613.530.0517",
    "city": "Napanee",
    "province": "ON"
  },
  {
    "firm": "Ron Poliwoda R.E. Appraiser",
    "phone": "905.709.8634",
    "city": "Thornhill",
    "province": "ON"
  },
  {
    "firm": "Royal Lepage Team Advantage Realty",
    "phone": "705.746.5844",
    "city": "Parry Sound",
    "province": "ON"
  },
  {
    "firm": "S L Purdy & Associates Ltd.",
    "phone": "613.827.7849",
    "city": "Belleville",
    "province": "ON"
  },
  {
    "firm": "S Rayner & Associates Ltd.",
    "phone": "613.384.8921",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "firm": "Silva Terra Realty",
    "phone": "705.335.0087",
    "city": "Kapuskasing",
    "province": "ON"
  },
  {
    "firm": "Simcoe Muskoka R.E. Appraisals",
    "phone": "705.645.3663",
    "city": "Bracebridge",
    "province": "ON"
  },
  {
    "firm": "Simon & Associates Ltd.",
    "phone": "416.398.1234",
    "city": "Woodbridge",
    "province": "ON"
  },
  {
    "firm": "South Coast Appraisals",
    "phone": "519.428.9916",
    "city": "Simcoe",
    "province": "ON"
  },
  {
    "firm": "Steele & Associates   TImmins",
    "phone": "705.471.1173",
    "city": "Timmins",
    "province": "ON"
  },
  {
    "firm": "Stewart & Milhausen",
    "phone": "705.445.2123",
    "city": "Collingwood",
    "province": "ON"
  },
  {
    "firm": "T. McCormick & Assoc",
    "phone": "416.324.2939",
    "city": "Markham",
    "province": "ON"
  },
  {
    "firm": "T.R. Yuill Appraisal Services",
    "phone": "705.690.4744",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "firm": "Town & Country Appraisals",
    "phone": "905.318.1577",
    "city": "Hamilton",
    "province": "ON"
  },
  {
    "firm": "Tri County Appraisals",
    "phone": "226.236.1100",
    "city": "Aylmer",
    "province": "ON"
  },
  {
    "firm": "True North Realty",
    "phone": "705.335.2361",
    "city": "Kapuskasing",
    "province": "ON"
  },
  {
    "firm": "Woodview Real Estate Appraisals",
    "phone": "905.630.2600",
    "city": "Burlington",
    "province": "ON"
  },
  {
    "firm": "Affiliated Property Group",
    "phone": "613.728.3991",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "Alexander McMillan R.E. Appraisal Services",
    "phone": "613.341.9583",
    "city": "Addison",
    "province": "ON"
  },
  {
    "firm": "Algoma Property Appraisals",
    "phone": "705.256.7177",
    "city": "Sault Ste Marie",
    "province": "ON"
  },
  {
    "firm": "All Realty Consultants",
    "phone": "416.630.5800",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Appraisal Group Thunder Bay",
    "phone": "807.344.8886",
    "city": "Thunder Bay",
    "province": "ON"
  },
  {
    "firm": "Appraisal Professionals Scott Radic",
    "phone": "416.720.8719",
    "city": "Aurora",
    "province": "ON"
  },
  {
    "firm": "Appraisals Niagara",
    "phone": "905.357.7187",
    "city": "Niagara Falls",
    "province": "ON"
  },
  {
    "firm": "Appraisers Consulting Group of Canada Inc",
    "phone": "905.761.7227",
    "city": "Vaughan",
    "province": "ON"
  },
  {
    "firm": "Armstrong Appraisal Services",
    "phone": "647.346.6409",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Ashdown Appraisals",
    "phone": "519.336.9424",
    "city": "Sarnia",
    "province": "ON"
  },
  {
    "firm": "Assurance Appraisal Inc.",
    "phone": "416.471.0176",
    "city": "Richmond Hill",
    "province": "ON"
  },
  {
    "firm": "Assured Appraisal Services",
    "phone": "905.764.6205",
    "city": "Richmond Hill",
    "province": "ON"
  },
  {
    "firm": "Baayen Appraisals",
    "phone": "905.373.6990",
    "city": "Cobourg",
    "province": "ON"
  },
  {
    "firm": "Baayen Associates Appraisers",
    "phone": "705.745.7777",
    "city": "",
    "province": "ON"
  },
  {
    "firm": "Baayen Real Estate Appraisers",
    "phone": "905.718.9493",
    "city": "Whitby",
    "province": "ON"
  },
  {
    "firm": "Barker Real Estate Appraisals",
    "phone": "905.451.6220",
    "city": "",
    "province": "ON"
  },
  {
    "firm": "Barry Wood Appraisals",
    "phone": "613.561.5443",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "firm": "Bastien Appraisals",
    "phone": "905.845.3300",
    "city": "Burlington",
    "province": "ON"
  },
  {
    "firm": "Bayside Appraisals",
    "phone": "519.599.6950",
    "city": "Thornbury",
    "province": "ON"
  },
  {
    "firm": "Bell Appraisals",
    "phone": "705.671.2355",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "firm": "Bellai & Associates Appraisal",
    "phone": "519.821.7859",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "firm": "Berk Appraisal Inc.",
    "phone": "289.238.8621",
    "city": "Dundas",
    "province": "ON"
  },
  {
    "firm": "Bill Miko",
    "phone": "519.741.6470",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "firm": "Blake Matlock and Marshal Ltd.",
    "phone": "519.940.0900",
    "city": "Orangeville",
    "province": "ON"
  },
  {
    "firm": "Bosveld Appraisals",
    "phone": "519.434.1935",
    "city": "London",
    "province": "ON"
  },
  {
    "firm": "Brant Residential Appraisals",
    "phone": "519.753.6231",
    "city": "",
    "province": "ON"
  },
  {
    "firm": "Brox Appraisals Inc",
    "phone": "519.240.5390",
    "city": "",
    "province": "ON"
  },
  {
    "firm": "Century 21 Limestone Realty Ltd",
    "phone": "613.384.4441 x309",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "firm": "Chantal Lavigne",
    "phone": "613.433.3736",
    "city": "Renfrew",
    "province": "ON"
  },
  {
    "firm": "Consolidated Appraisal Service Ltd",
    "phone": "705.739.1560",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "firm": "Cornerstone Appraisals",
    "phone": "519.822.2126",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "firm": "Coulson & Company Appraisal Ltd",
    "phone": "905.333.3140",
    "city": "Burlington",
    "province": "ON"
  },
  {
    "firm": "Cross Town Appraisals",
    "phone": "416.652.3456",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Daniel Barrons Real Estate Appraisals",
    "phone": "519 542 1533",
    "city": "Sarnia",
    "province": "ON"
  },
  {
    "firm": "Dennis J Murphy Real Estate Appraisers",
    "phone": "705.737.5100",
    "city": "Midhurst",
    "province": "ON"
  },
  {
    "firm": "Denomme Appraisals",
    "phone": "705.672.5610",
    "city": "Collingwood",
    "province": "ON"
  },
  {
    "firm": "Di Tosto Appraisal Serv",
    "phone": "416.913.0590",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Ed Poisson Residential Appraisal Services",
    "phone": "519.792.4318",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "firm": "Elio Bellai",
    "phone": "519.821.7859",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "firm": "Enns MacEachern Pace Maloney",
    "phone": "613.932.1812",
    "city": "Cornwall",
    "province": "ON"
  },
  {
    "firm": "Everts Realty Appraisals and Co",
    "phone": "613.728.4435",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "F.R. Jordan & Associates",
    "phone": "519.974.0186",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "firm": "Farley & Associates Ltd",
    "phone": "613.561.5328",
    "city": "London",
    "province": "ON"
  },
  {
    "firm": "Fletcher Professional Realty Appraisal",
    "phone": "905.829.4916",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "firm": "Hastings Appraisal Services",
    "phone": "613.392.1818",
    "city": "Trenton",
    "province": "ON"
  },
  {
    "firm": "Hendren Appraisals",
    "phone": "905.450.3307",
    "city": "Brampton",
    "province": "ON"
  },
  {
    "firm": "HG Appraisers Inc formerly Hutchenson Gignac Ltd.",
    "phone": "705.445.7414",
    "city": "Collingwood",
    "province": "ON"
  },
  {
    "firm": "Hill Appraisals",
    "phone": "905.775.9320",
    "city": "Bradford",
    "province": "ON"
  },
  {
    "firm": "Holmes Appraisals",
    "phone": "613.530.0726",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "firm": "Home Base Appraisal Services",
    "phone": "519.364.7155",
    "city": "Walkerton",
    "province": "ON"
  },
  {
    "firm": "Homefacts R E Services",
    "phone": "905.333.3321",
    "city": "Burlington",
    "province": "ON"
  },
  {
    "firm": "Independent Appraisals",
    "phone": "613.564.8282",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "J R Rogers Appraisals",
    "phone": "613.561.5328",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "firm": "Jack Graves Realty Ltd",
    "phone": "519.842.9001",
    "city": "Tillsonburg",
    "province": "ON"
  },
  {
    "firm": "James Michael Appraisals",
    "phone": "905.719.0505",
    "city": "Hamilton",
    "province": "ON"
  },
  {
    "firm": "Janterra Real Estate Advisors Inc.",
    "phone": "416.423.3334",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Jeff Derochie Appraisal Service",
    "phone": "519.564.1703",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "firm": "Jill Murphy Res App Serv",
    "phone": "905.338.9772",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "firm": "Johannsen Appraisal Services",
    "phone": "705.675.7180",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "firm": "Julian Patteson Real Estate Appraising & Consulting",
    "phone": "519.725.0244",
    "city": "Cambridge",
    "province": "ON"
  },
  {
    "firm": "John Pignotta Realties Ltd.",
    "phone": "519.759.8810",
    "city": "Brantford",
    "province": "ON"
  },
  {
    "firm": "Kahle Appraisals",
    "phone": "519.273.5707",
    "city": "Stratford",
    "province": "ON"
  },
  {
    "firm": "KF McComb Appraisal Services",
    "phone": "705.946.2696",
    "city": "Sault Ste Marie",
    "province": "ON"
  },
  {
    "firm": "LaFontaine Appraisals",
    "phone": "519.763.5870",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "firm": "LeBreton Appraisal Services",
    "phone": "613.761.9969",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "LOCC R. E Appraisal Inc.",
    "phone": "519.344.5622",
    "city": "Sarnia",
    "province": "ON"
  },
  {
    "firm": "Market Search Appraisals",
    "phone": "519.323.2454",
    "city": "Mount Forest",
    "province": "ON"
  },
  {
    "firm": "McCutcheon Appraisal Services",
    "phone": "613.453.8336",
    "city": "Roblin",
    "province": "ON"
  },
  {
    "firm": "McIver Group Inc",
    "phone": "519.870.0663",
    "city": "London",
    "province": "ON"
  },
  {
    "firm": "Metro wide Appraisal Services",
    "phone": "905.479.4400",
    "city": "Markham",
    "province": "ON"
  },
  {
    "firm": "Midland Appraisals",
    "phone": "705.534.0316",
    "city": "Midland",
    "province": "ON"
  },
  {
    "firm": "Morland R. E. Appraisals",
    "phone": "705.474.3500",
    "city": "North Bay",
    "province": "ON"
  },
  {
    "firm": "MW Cotman & Associates formerly D.A. McGugan & Associates",
    "phone": "613.634.2223",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "firm": "North Broadfoot Gribbon",
    "phone": "613.727.2677",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "Northern Ontario Appraisals",
    "phone": "705.268.6600",
    "city": "Timmins",
    "province": "ON"
  },
  {
    "firm": "Ontario Appraisal Corp",
    "phone": "416.674.1041",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Paul Raymer Appraisals",
    "phone": "905.294.1267",
    "city": "Markham",
    "province": "ON"
  },
  {
    "firm": "Griesbach Consulting",
    "phone": "613.483.9145",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "firm": "Tarle & McAllister Appraisals",
    "phone": "613.937.4912",
    "city": "Cornwall",
    "province": "ON"
  },
  {
    "firm": "Terri Thomson",
    "phone": "519.940.1075",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "firm": "The Real Estate Consulting Group",
    "phone": "416.322.7888",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Tracey Brisson Appraisals CRA",
    "phone": "613.863.5047",
    "city": "Embrun",
    "province": "ON"
  },
  {
    "firm": "Van Walraven Appraisals Inc",
    "phone": "613.226.8607",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "Walker & Walker Appraisal Ltd",
    "phone": "905.639.0235",
    "city": "Burlington",
    "province": "ON"
  },
  {
    "firm": "Warnica Poste Appraisals",
    "phone": "705.739.0240",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "firm": "Steven Elliot Appraisals",
    "phone": "519.240.0719",
    "city": "Brantford",
    "province": "ON"
  },
  {
    "firm": "Wellington Appraisal",
    "phone": "519 843.3292",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "firm": "Westview Appraisal Services",
    "phone": "905.821.2062",
    "city": "Mississauga",
    "province": "ON"
  },
  {
    "firm": "Williamson & Associates Real Estate Appraisers",
    "phone": "705.750.1125",
    "city": "Peterborough",
    "province": "ON"
  },
  {
    "firm": "Zee Appraisal & Consulting Inc",
    "phone": "416.788.2033",
    "city": "North York",
    "province": "ON"
  },
  {
    "firm": "Zorn Appraisal Services Ltd.",
    "phone": "905.831.6780",
    "city": "Pickering",
    "province": "ON"
  },
  {
    "firm": "Preferred Appraisals",
    "phone": "705.770.2112",
    "city": "Wasaga Beach",
    "province": "ON"
  },
  {
    "firm": "Progressive Appraisal Services Inc",
    "phone": "519.461.9468",
    "city": "Thorndale",
    "province": "ON"
  },
  {
    "firm": "PVCI Inc",
    "phone": "905.666.5023",
    "city": "Whitby",
    "province": "ON"
  },
  {
    "firm": "Antec Appraisal Group East",
    "phone": "905.985.6291",
    "city": "Port Perry",
    "province": "ON"
  },
  {
    "firm": "R. W. Dyer Realty Inc",
    "phone": "519.653.5353",
    "city": "Cambridge",
    "province": "ON"
  },
  {
    "firm": "R J Lyons Real Estate Appraisal Services Inc",
    "phone": "519.672.0485",
    "city": "London",
    "province": "ON"
  },
  {
    "firm": "Rae Appraisals Ltd",
    "phone": "905.845.6540",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "firm": "Rajesky & Associates",
    "phone": "905.709.9595",
    "city": "Thornhill",
    "province": "ON"
  },
  {
    "firm": "Ray Bower Appraisal Services Inc",
    "phone": "519.944.5005",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "firm": "Real Estate Appraiser and Consulting",
    "phone": "519.725.0244",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "firm": "Reliable Appraisal Services",
    "phone": "905.820.0560",
    "city": "Mississauga",
    "province": "ON"
  },
  {
    "firm": "Ridley & Associates",
    "phone": "905.685.8827",
    "city": "Catharines",
    "province": "ON"
  },
  {
    "firm": "Rivington Associates Inc",
    "phone": "613.267.6800",
    "city": "Perth",
    "province": "ON"
  },
  {
    "firm": "Ron Hopper Real Estate Limited Broker",
    "phone": "519.371.5550",
    "city": "Owen Sound",
    "province": "ON"
  },
  {
    "firm": "Royal Lepage   Lannon Realty Appraisal Division",
    "phone": "807.624.2651",
    "city": "Thunder Bay",
    "province": "ON"
  },
  {
    "firm": "Szpivak & Associates Inc.",
    "phone": "613.931.3333",
    "city": "Summerstown",
    "province": "ON"
  },
  {
    "firm": "Ryan Realty Services Ltd.",
    "phone": "905.434.5128",
    "city": "Courtice",
    "province": "ON"
  },
  {
    "firm": "S Andrews & Assoc Appraisals",
    "phone": "905.886.5222",
    "city": "Makham",
    "province": "ON"
  },
  {
    "firm": "S. Derochie and Associates",
    "phone": "519.965.8480",
    "city": "Cottam",
    "province": "ON"
  },
  {
    "firm": "S. Rayner & Associates Ltd.",
    "phone": "613.384.8921",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "firm": "Scanlon & Associates",
    "phone": "705.326.2531",
    "city": "Orillia",
    "province": "ON"
  },
  {
    "firm": "Schinkel Appraisals",
    "phone": "905.387.0100",
    "city": "Hamilton",
    "province": "ON"
  },
  {
    "firm": "Shore Tanner & Associates",
    "phone": "613.224.8484",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "Sovereign Appraisals Ltd.",
    "phone": "519.966.0222",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "firm": "Stanshall & Associates",
    "phone": "519.750.1761",
    "city": "Brantford",
    "province": "ON"
  },
  {
    "firm": "TM Appraisals Inc",
    "phone": "416.324.2939",
    "city": "Markham",
    "province": "ON"
  },
  {
    "firm": "Talbot Appraisal Services",
    "phone": "519.633.9150",
    "city": "Thomas",
    "province": "ON"
  },
  {
    "firm": "Able Real Estate Appraisers",
    "phone": "613.226.7115",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "Home Value Inc.",
    "phone": "416.871.9224",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Regional Appraisals Inc",
    "phone": "905.356.6646",
    "city": "Niagara Falls",
    "province": "ON"
  },
  {
    "firm": "City Management & Appraisals Ltd.",
    "phone": "519.578.3300",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "firm": "Shields Appraisals & Consulting Ltd",
    "phone": "705.542.8830",
    "city": "Sault Ste Marie",
    "province": "ON"
  },
  {
    "firm": "Kennedy Appraisals Inc.",
    "phone": "519.227.2092",
    "city": "Lucan",
    "province": "ON"
  },
  {
    "firm": "Richard Tyas Realty Ltd",
    "phone": "519.735.2862",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "firm": "DRW Appraisals Inc.",
    "phone": "905.995.3966",
    "city": "Brooklin",
    "province": "ON"
  },
  {
    "firm": "JM Cox & Associates Ltd",
    "phone": "613.831.0344",
    "city": "Stittsville",
    "province": "ON"
  },
  {
    "firm": "York Simcoe Appraisal Corp Ltd.",
    "phone": "905.836.1028",
    "city": "Newmarket",
    "province": "ON"
  },
  {
    "firm": "Everest Appraisal Services",
    "phone": "905.686.3172",
    "city": "Ajax",
    "province": "ON"
  },
  {
    "firm": "W. J Dietrich Ltd.",
    "phone": "705.743.4554",
    "city": "Peterborough",
    "province": "ON"
  },
  {
    "firm": "Ron Merkley Real Estate & Appraisals Inc.",
    "phone": "1.877.465.8100",
    "city": "Brockville",
    "province": "ON"
  },
  {
    "firm": "B.E. Page Appraisal Services",
    "phone": "705.350.1574",
    "city": "Orillia",
    "province": "ON"
  },
  {
    "firm": "Gateway Valuations Canada",
    "phone": "519.981.8896",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "firm": "Core Consulting Group",
    "phone": "416.556.5341",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Pocrnic Realty Advisors Inc.",
    "phone": "905.522.7936",
    "city": "Hamilton",
    "province": "ON"
  },
  {
    "firm": "Don Martindale Real Estate Appraisal",
    "phone": "905.442.3393",
    "city": "Newcastle",
    "province": "ON"
  },
  {
    "firm": "Callaghan Appraisal Services",
    "phone": "705.324.2972",
    "city": "Cameron",
    "province": "ON"
  },
  {
    "firm": "Kawartha Lakes Appraisal",
    "phone": "705.328.1399",
    "city": "Lindsay",
    "province": "ON"
  },
  {
    "firm": "Century 21 Granite Properties",
    "phone": "705.746.2158",
    "city": "Parry Sound",
    "province": "ON"
  },
  {
    "firm": "Steele & Associates",
    "phone": "705.471.1173",
    "city": "North Bay",
    "province": "ON"
  },
  {
    "firm": "Donati Appraisals",
    "phone": "519.284.3344",
    "city": "St. Marys",
    "province": "ON"
  },
  {
    "firm": "Sprint Residential Appraisals",
    "phone": "519.577.7288",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "firm": "A&M Property Appraisals Ltd.",
    "phone": "705.531.3111",
    "city": "Timmins",
    "province": "ON"
  },
  {
    "firm": "Premier Appraisal Services Inc",
    "phone": "905.619.9523",
    "city": "Ajax",
    "province": "ON"
  },
  {
    "firm": "Rivington's of Pembroke Inc.",
    "phone": "613.735.4627",
    "city": "Pembroke",
    "province": "ON"
  },
  {
    "firm": "S.W. Irvine & Associates Ltd.",
    "phone": "519.763.5956",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "firm": "Lea Robertson CRA",
    "phone": "705.789.4957",
    "city": "Huntsville",
    "province": "ON"
  },
  {
    "firm": "Constant Appraisals",
    "phone": "416.566.2515",
    "city": "Mississauga",
    "province": "ON"
  },
  {
    "firm": "Halton Property Appraisals",
    "phone": "905.338.3353",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "firm": "Schleifer & Associates Real Estate Appraisals",
    "phone": "519.753.1901",
    "city": "Waterford",
    "province": "ON"
  },
  {
    "firm": "Georgian Appraisals",
    "phone": "519.376.2821",
    "city": "Owen Sound",
    "province": "ON"
  },
  {
    "firm": "Harman Appraisal Services",
    "phone": "613.266.8045",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "Antec Appraisal Group   Hamilton",
    "phone": "905.777.1225 x107",
    "city": "Burlington",
    "province": "ON"
  },
  {
    "firm": "The Appraisal Company",
    "phone": "905.329.0197",
    "city": "St. Catherines",
    "province": "ON"
  },
  {
    "firm": "K. Murphy Real Estate Appraisal Services",
    "phone": "519.359.4693",
    "city": "Chatham",
    "province": "ON"
  },
  {
    "firm": "M. Machel & Associates Ltd.",
    "phone": "519.578.5444 x231",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "firm": "Accurate Peel Appraisals Inc.",
    "phone": "905.838.2490",
    "city": "Caledon",
    "province": "ON"
  },
  {
    "firm": "Murray A Farrell & Associates",
    "phone": "519.539.0413",
    "city": "Woodstock",
    "province": "ON"
  },
  {
    "firm": "MHA Appraisals",
    "phone": "519.365.6329",
    "city": "Chatham",
    "province": "ON"
  },
  {
    "firm": "Tiller Appraisals",
    "phone": "705.718.9211",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "firm": "Michel Rozon & Associates",
    "phone": "613.551.9747",
    "city": "Hawkesbury",
    "province": "ON"
  },
  {
    "firm": "Dickson Appraisals",
    "phone": "705.690.7267",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "firm": "Lohmer Real Estate & Appraisals Ltd",
    "phone": "519.743.0000",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "firm": "Exclusive Property Appraisals Inc",
    "phone": "416.273.5200",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Randy Jackson Residential Appraisals",
    "phone": "705.726.5166",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "firm": "Hammell Appraisals   Teresa Hammell",
    "phone": "705.768.4713",
    "city": "Peterborough",
    "province": "ON"
  },
  {
    "firm": "A.L.L. Appraisal Services Ltd   Michael Lau",
    "phone": "1.855.201.6808",
    "city": "Etobicoke",
    "province": "ON"
  },
  {
    "firm": "Waterside Real Estate Group",
    "phone": "905.802.1254",
    "city": "Ancaster",
    "province": "ON"
  },
  {
    "firm": "Brisson & Associates",
    "phone": "613.632.3325",
    "city": "Hawkesbury",
    "province": "ON"
  },
  {
    "firm": "Johnson Pietz Consulting Group",
    "phone": "905.892.0611",
    "city": "Fonthill",
    "province": "ON"
  },
  {
    "firm": "Essential Appraisal Services Ltd",
    "phone": "905.432.7111",
    "city": "Courtice",
    "province": "ON"
  },
  {
    "firm": "Plaxton Appraisal Services",
    "phone": "705.526.4445",
    "city": "Midland",
    "province": "ON"
  },
  {
    "firm": "Tri North Real Estate Appraisals",
    "phone": "905.954.5911",
    "city": "Grimsby",
    "province": "ON"
  },
  {
    "firm": "Acuity Professional Appraisals",
    "phone": "1.800.239.2280",
    "city": "Markham",
    "province": "ON"
  },
  {
    "firm": "Swan Appraisals Inc. J. Swan",
    "phone": "705.526.4271",
    "city": "Midland",
    "province": "ON"
  },
  {
    "firm": "Musso Appraisals & Consulting Inc.",
    "phone": "519.741.8700",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "firm": "Avery Appraisals",
    "phone": "905.727.7641",
    "city": "Aurora",
    "province": "ON"
  },
  {
    "firm": "Precise Real Estate Appraising Inc.",
    "phone": "519.221.2224",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "firm": "iAppraise Inc",
    "phone": "1.888.749.4649",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "firm": "Murray Appraisals",
    "phone": "519.276.9165",
    "city": "Stratford",
    "province": "ON"
  },
  {
    "firm": "Wieland & Associates Inc.",
    "phone": "",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "Accredited Appraisal Services Inc",
    "phone": "416.729.4395",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "firm": "Top Class Appraisal",
    "phone": "416.569.9792",
    "city": "Markham",
    "province": "ON"
  },
  {
    "firm": "Appraisal Advantage Canada Incorporated",
    "phone": "416.570.6489",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Appraisal Hub Inc",
    "phone": "1.888.728.8482",
    "city": "Richmond Hill",
    "province": "ON"
  },
  {
    "firm": "North Muskoka Appraisals",
    "phone": "705.380.5485",
    "city": "Huntsville",
    "province": "ON"
  },
  {
    "firm": "KS Appraisal Services",
    "phone": "905.269.3937",
    "city": "Baltimore",
    "province": "ON"
  },
  {
    "firm": "RPG Real Estate Services Inc",
    "phone": "416.268.8605",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Dekker Appraisal Services",
    "phone": "416.571.4098",
    "city": "Grand Valley",
    "province": "ON"
  },
  {
    "firm": "Aaron Appraisals Ltd",
    "phone": "416.480.9162",
    "city": "Richmond Hill",
    "province": "ON"
  },
  {
    "firm": "Sharp Appraisal & Consulting",
    "phone": "416.887.7001",
    "city": "Concord",
    "province": "ON"
  },
  {
    "firm": "McFarlane Appraisals",
    "phone": "705.999.5595",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "firm": "Total Value Appraisals Inc",
    "phone": "519.365.6329",
    "city": "Chatham-Kent",
    "province": "ON"
  },
  {
    "firm": "Van Walravin Appraisal Services",
    "phone": "",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "firm": "Brighthouse Appraisals",
    "phone": "416.450.6196",
    "city": "Stouffville",
    "province": "ON"
  },
  {
    "firm": "Grand River Appraisal Services",
    "phone": "519.658.3283",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "firm": "Midtown Appraisal Group Inc",
    "phone": "289.238.9199",
    "city": "Dundas",
    "province": "ON"
  },
  {
    "firm": "Comeau Appraisals",
    "phone": "905.853.2050",
    "city": "Sharon",
    "province": "ON"
  },
  {
    "firm": "Cityview Appraisal Ltd",
    "phone": "905.901.0030",
    "city": "Markham",
    "province": "ON"
  },
  {
    "firm": "Express Appraisal Services",
    "phone": "416.895.1975",
    "city": "Scugog",
    "province": "ON"
  },
  {
    "firm": "Bona Fide Appraisals Inc",
    "phone": "905.901.4926",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "firm": "House Inc. Appraisal Services",
    "phone": "647.499.2781",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "Metrix Southwest Inc",
    "phone": "519.672.7550",
    "city": "London",
    "province": "ON"
  },
  {
    "firm": "GH Valorem Group Inc",
    "phone": "613.890.4720",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "firm": "Vane Property Appraisals",
    "phone": "249.361.3220",
    "city": "Timmins",
    "province": "ON"
  },
  {
    "firm": "Quinte Appraisal Services Ltd",
    "phone": "613.395.2746",
    "city": "Belleville",
    "province": "ON"
  },
  {
    "firm": "Riverbend Appraisals Ltd",
    "phone": "226.973.3158",
    "city": "London",
    "province": "ON"
  },
  {
    "firm": "Area Real Estate Appraisers",
    "phone": "705.759.2072",
    "city": "Sault Ste Marie",
    "province": "ON"
  },
  {
    "firm": "Appear Appraisals Inc",
    "phone": "647.896.4265",
    "city": "Brampton",
    "province": "ON"
  },
  {
    "firm": "LBREA",
    "phone": "905.375.4485",
    "city": "Baltimore",
    "province": "ON"
  },
  {
    "firm": "Avison Young",
    "phone": "905.474.1155",
    "city": "Markham",
    "province": "ON"
  },
  {
    "firm": "CHS Realty Advisors SW Inc.",
    "phone": "519.994.0158",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "firm": "Parry Sound  Muskoka Appraisals Ltd",
    "phone": "705.822.7862",
    "city": "Ontario",
    "province": "ON"
  },
  {
    "firm": "IGL Appraisal Group",
    "phone": "905.321.1085",
    "city": "Thorold",
    "province": "ON"
  },
  {
    "firm": "DNC (David, Nicole & Co.) Real Estate Appraisal & Consulting",
    "phone": "647.372.1555",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "firm": "Rivington Appraisers Inc.",
    "phone": "613.267.6800",
    "city": "Perth",
    "province": "ON"
  },
  {
    "firm": "Accurate Appraisal (Ontario)",
    "phone": "519.630.1794",
    "city": "London",
    "province": "ON"
  },
  {
    "firm": "Bancroft Appraisal Services Ltd",
    "phone": "613.332.4444",
    "city": "Bancroft",
    "province": "ON"
  },
  {
    "firm": "DM Real Estate Appraisal",
    "phone": "905.442.3393",
    "city": "Newcastle",
    "province": "ON"
  },
  {
    "firm": "Modern Appraisals",
    "phone": "705.269.1669",
    "city": "Cochrane",
    "province": "ON"
  },
  {
    "firm": "1000418501 Ontario Inc",
    "phone": "519.376.2821",
    "city": "Owen Sound",
    "province": "ON"
  },
  {
    "firm": "CDC Inc",
    "phone": "866.479.7922",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "firm": "McComb Appraisal Services",
    "phone": "705.943.6739",
    "city": "Sault Ste Marie",
    "province": "ON"
  },
  {
    "firm": "A3   Accredited Appraisal Associates",
    "phone": "902.388.0251",
    "city": "Charlottetown",
    "province": "PEI"
  },
  {
    "firm": "Altus Group",
    "phone": "902.368.3177",
    "city": "Charlottetown",
    "province": "PEI"
  },
  {
    "firm": "Brad Oliver Realty Inc.",
    "phone": "902.838.4000",
    "city": "Monteague",
    "province": "PEI"
  },
  {
    "firm": "Bradley Appraisals",
    "phone": "902.436.6395",
    "city": "Summerside",
    "province": "PEI"
  },
  {
    "firm": "Delaney Appraisal Services",
    "phone": "902.393.5640",
    "city": "Cornwall",
    "province": "PEI"
  },
  {
    "firm": "Harbord Rogers & Associates",
    "phone": "1.902.888.3920",
    "city": "Summerside",
    "province": "PEI"
  },
  {
    "firm": "Quality Appraisal Services PEI",
    "phone": "902.628.9674",
    "city": "Charlottetown",
    "province": "PEI"
  },
  {
    "firm": "A.J. MacDonald Appraisals",
    "phone": "902.626.9742",
    "city": "Montague",
    "province": "PEI"
  },
  {
    "firm": "Griffin Appraisal Services",
    "phone": "902.626.3456",
    "city": "Charlottetown",
    "province": "PEI"
  },
  {
    "firm": "9149 1845 Quebec INC",
    "phone": "514.899.0823",
    "city": "Laval",
    "province": "QC"
  },
  {
    "firm": "BourqueDupere Simard & Ass.",
    "phone": "418.392.5058",
    "city": "New Richmond",
    "province": "QC"
  },
  {
    "firm": "Devimo Inc.",
    "phone": "514.710.2314",
    "city": "Repentigny",
    "province": "QC"
  },
  {
    "firm": "Dufresne Savary & Associes",
    "phone": "819.823.9715",
    "city": "Sherbrooke",
    "province": "QC"
  },
  {
    "firm": "Evaluation ECB Appraisals",
    "phone": "613.720.1349",
    "city": "Ottawa",
    "province": "QC"
  },
  {
    "firm": "Evaluation D. Leveille Inc.",
    "phone": "819.623.4481",
    "city": "Mont Laurier",
    "province": "QC"
  },
  {
    "firm": "Evaluation Immobiliere Paquette",
    "phone": "418 618.3256",
    "city": "Saint Felicien",
    "province": "QC"
  },
  {
    "firm": "Evaluations Immobilieres Evimag Inc.",
    "phone": "450 674.2325",
    "city": "Longueuil",
    "province": "QC"
  },
  {
    "firm": "Evaluations Manicouagan Inc.",
    "phone": "418.589.9005",
    "city": "Baie Comeau",
    "province": "QC"
  },
  {
    "firm": "Evaluation Perron",
    "phone": "506.789.8854",
    "city": "Pointe a la Croix",
    "province": "QC"
  },
  {
    "firm": "Evaluation Prestige",
    "phone": "514.797.3825",
    "city": "Longueuil",
    "province": "QC"
  },
  {
    "firm": "Evaluation SMP",
    "phone": "418.952.6728",
    "city": "De L'Atlas",
    "province": "QC"
  },
  {
    "firm": "Groupe Poulin Services Immobiliers Inc",
    "phone": "418.683.2929",
    "city": "Quebec City",
    "province": "QC"
  },
  {
    "firm": "Joe Tremblay Inc",
    "phone": "514.813.1758",
    "city": "Candiac",
    "province": "QC"
  },
  {
    "firm": "Les Evaluations Immob Richard",
    "phone": "418.968.1740",
    "city": "Sept Iles",
    "province": "QC"
  },
  {
    "firm": "Les Evaluations Pascal Arsenaul",
    "phone": "418.856.1958",
    "city": "La Pocatiere",
    "province": "QC"
  },
  {
    "firm": "Levesque Pires Caron & associes",
    "phone": "800.363.8237",
    "city": "Blainville",
    "province": "QC"
  },
  {
    "firm": "L' Immobiliere societe d evaluation conseil inc",
    "phone": "418.543.7775",
    "city": "Chicoutimi",
    "province": "QC"
  },
  {
    "firm": "Martel Villemure & Chouinard INC",
    "phone": "819.379.6809  x215",
    "city": "Trois Rivieres",
    "province": "QC"
  },
  {
    "firm": "Martin Roch Evaluation",
    "phone": "819.732.7602",
    "city": "Amos",
    "province": "QC"
  },
  {
    "firm": "Remy Auclair Val D'or",
    "phone": "819.825.4777",
    "city": "Val d'Or",
    "province": "QC"
  },
  {
    "firm": "Rene Collard Evaluateur Immobilier Inc",
    "phone": "819.797.9252",
    "city": "Rouyn Noranda",
    "province": "QC"
  },
  {
    "firm": "S. Blais & Associes",
    "phone": "819.778.0300",
    "city": "Gatineau",
    "province": "QC"
  },
  {
    "firm": "Sylvestre Leblond & Associes Granby",
    "phone": "450.777.3478",
    "city": "Granby",
    "province": "QC"
  },
  {
    "firm": "TrudellMontcalm & Associes",
    "phone": "450.377.3879",
    "city": "Valleyfield",
    "province": "QC"
  },
  {
    "firm": "Vincent Ladouceur Evaluateur Immobilier Inc",
    "phone": "450.963.2777",
    "city": "Laval",
    "province": "QC"
  },
  {
    "firm": "Baillargeon Bergeron Deneault Inc",
    "phone": "450.359.9633",
    "city": "Saint Jean Sur Richelieu",
    "province": "QC"
  },
  {
    "firm": "Bertrand Simard",
    "phone": "450 759.7771",
    "city": "Saint Charles Borromee",
    "province": "QC"
  },
  {
    "firm": "Brisson Tremblay & Assoc",
    "phone": "418.545.4941",
    "city": "Chicoutimi",
    "province": "QC"
  },
  {
    "firm": "Cevinec",
    "phone": "",
    "city": "Dolbeau Mistassini",
    "province": "QC"
  },
  {
    "firm": "Chaumont & Assoc",
    "phone": "",
    "city": "Trois Rivieres",
    "province": "QC"
  },
  {
    "firm": "De Rico Hurtubuise Assoc",
    "phone": "418.835.5400",
    "city": "Sainte Foy",
    "province": "QC"
  },
  {
    "firm": "Dugre & Assoc",
    "phone": "819.752.4369",
    "city": "Victoriaville",
    "province": "QC"
  },
  {
    "firm": "ECGL",
    "phone": "418.627.3521",
    "city": "Quebec City",
    "province": "QC"
  },
  {
    "firm": "Evaluation Imm Laurentides",
    "phone": "514.745.6488",
    "city": "Montreal",
    "province": "QC"
  },
  {
    "firm": "Evaluations Baril",
    "phone": "819.373.1401",
    "city": "Trois Rivieres",
    "province": "QC"
  },
  {
    "firm": "Evaluations Mauricie",
    "phone": "819.372.9733",
    "city": "Trois Rivieres",
    "province": "QC"
  },
  {
    "firm": "Gauthier Roy Huot Ass",
    "phone": "",
    "city": "Saint Lambert",
    "province": "QC"
  },
  {
    "firm": "Godbout Joseph & Assoc",
    "phone": "819.723.7575",
    "city": "Rimouski",
    "province": "QC"
  },
  {
    "firm": "Groupe Axival",
    "phone": "514.899.0823",
    "city": "Montreal",
    "province": "QC"
  },
  {
    "firm": "Groupe Casa",
    "phone": "",
    "city": "",
    "province": "QC"
  },
  {
    "firm": "Immovex Gestion et Evaluation Immobilieres",
    "phone": "450.671.9205",
    "city": "Brossard",
    "province": "QC"
  },
  {
    "firm": "Janson, Thibault, Ryan",
    "phone": "514.418.4497",
    "city": "Montreal",
    "province": "QC"
  },
  {
    "firm": "Jean Rocheleau & Assoc",
    "phone": "514.333.4495",
    "city": "Montreal",
    "province": "QC"
  },
  {
    "firm": "Michel Paquin",
    "phone": "819.243.3001",
    "city": "Gatineau",
    "province": "QC"
  },
  {
    "firm": "Morin Roy & DEsilets",
    "phone": "",
    "city": "Sherbrooke",
    "province": "QC"
  },
  {
    "firm": "Patrick Mercure",
    "phone": "",
    "city": "",
    "province": "QC"
  },
  {
    "firm": "Paul Savary",
    "phone": "",
    "city": "Sherbrooke",
    "province": "QC"
  },
  {
    "firm": "Pierre Dufresne",
    "phone": "819.823.9715",
    "city": "Sherbrooke",
    "province": "QC"
  },
  {
    "firm": "Pigeon Roy",
    "phone": "819.243.5222",
    "city": "Gatineau",
    "province": "QC"
  },
  {
    "firm": "Remi Auclair",
    "phone": "",
    "city": "Val d'Or",
    "province": "QC"
  },
  {
    "firm": "Serge Lavoie",
    "phone": "",
    "city": "Ste Adele",
    "province": "QC"
  },
  {
    "firm": "Stephane Blais",
    "phone": "",
    "city": "Gatineau",
    "province": "QC"
  },
  {
    "firm": "Stephane Dompierre",
    "phone": "",
    "city": "Gatineau",
    "province": "QC"
  },
  {
    "firm": "SylvestreLeblond St Hyancinthe",
    "phone": "450 773.5897",
    "city": "St Hyancinthe",
    "province": "QC"
  },
  {
    "firm": "Raymond Joyal Cadieux Paquette & Associes Itee",
    "phone": "514.493.4422",
    "city": "Montreal",
    "province": "QC"
  },
  {
    "firm": "Evaluation 2000 Inc.",
    "phone": "877.735.5548",
    "city": "Riviere du Loup",
    "province": "QC"
  },
  {
    "firm": "Pierre Moreau & Associes",
    "phone": "514.424.6740",
    "city": "Montreal",
    "province": "QC"
  },
  {
    "firm": "Evaluatech",
    "phone": "418.591.0088",
    "city": "St Paul",
    "province": "QC"
  },
  {
    "firm": "Evaluation A.L. Faucher Inc.",
    "phone": "819.776.3929",
    "city": "Gatineau",
    "province": "QC"
  },
  {
    "firm": "M.C. Evaluations",
    "phone": "819 449.3687",
    "city": "Notre Dame",
    "province": "QC"
  },
  {
    "firm": "Paris Ladouceur",
    "phone": "450.963.2777",
    "city": "Laval",
    "province": "QC"
  },
  {
    "firm": "Yvon Poulin & Associes Inc",
    "phone": "418 683.2929",
    "city": "Quebec City",
    "province": "QC"
  },
  {
    "firm": "PCG Carmon Formerly PicardCrevierGuertin Assoc",
    "phone": "514.365.6664",
    "city": "Montreal",
    "province": "QC"
  },
  {
    "firm": "PCGCarmon Laval & St. Jerome Office",
    "phone": "450.530.2556",
    "city": "Notre Dame",
    "province": "QC"
  },
  {
    "firm": "Groupe Proval Evaluateurs Agrees",
    "phone": "855.697.0555",
    "city": "Boisbriand",
    "province": "QC"
  },
  {
    "firm": "Provost Sansfacon Societe D'Evaluateurs",
    "phone": "581.742.7353",
    "city": "Quebec City",
    "province": "QC"
  },
  {
    "firm": "Truefind",
    "phone": "877.717.2758",
    "city": "Saint Laurent",
    "province": "QC"
  },
  {
    "firm": "Evaluation Integrale Inc",
    "phone": "514.880.3129",
    "city": "Contrec\u0153ur",
    "province": "QC"
  },
  {
    "firm": "Dionne Plante & Associes",
    "phone": "418.724.0022",
    "city": "Mont Joli",
    "province": "QC"
  },
  {
    "firm": "GMA Consultants Inc",
    "phone": "514.840.9710",
    "city": "Laval",
    "province": "QC"
  },
  {
    "firm": "Evaluations Yves Gagnon",
    "phone": "418.968.2444",
    "city": "Sept Iles",
    "province": "QC"
  },
  {
    "firm": "Roger Lessard Evaluateur Agree",
    "phone": "819.583.5696",
    "city": "Lac Megantic",
    "province": "QC"
  },
  {
    "firm": "Evaluation Cote Nord",
    "phone": "418.297.0217",
    "city": "Baie Comeau",
    "province": "QC"
  },
  {
    "firm": "Evaluation Philippe Labelle",
    "phone": "819.968.2469",
    "city": "Gatineau",
    "province": "QC"
  },
  {
    "firm": "Evaluation VGM",
    "phone": "418.255.8055",
    "city": "Quebec City",
    "province": "QC"
  },
  {
    "firm": "Le Groupe Desnoyers & Associes",
    "phone": "450.650.1414",
    "city": "Boucherville",
    "province": "QC"
  },
  {
    "firm": "Valoris Evaluateurs Agrees Inc",
    "phone": "438.259.3149",
    "city": "Montreal",
    "province": "QC"
  },
  {
    "firm": "ABMS Evaluateurs Agrees",
    "phone": "514.938.2267",
    "city": "Montreal",
    "province": "QC"
  },
  {
    "firm": "Brunet-Lefebvre, Evaluateurs-Conseils Inc.",
    "phone": "514.813.1717",
    "city": "Chateauguay",
    "province": "QC"
  },
  {
    "firm": "Cap Immobilier",
    "phone": "514.788.0612",
    "city": "Saint-Jerome",
    "province": "QC"
  },
  {
    "firm": "Evaluation Immobilier Rive Nord",
    "phone": "450.621.1519",
    "city": "Lorraine",
    "province": "QC"
  },
  {
    "firm": "Les Evaluations Alain Latour",
    "phone": "514.962.9167",
    "city": "Montreal",
    "province": "QC"
  },
  {
    "firm": "Novea Inc",
    "phone": "450.558.5953",
    "city": "Sutton",
    "province": "QC"
  },
  {
    "firm": "Valueed",
    "phone": "855.482.5333",
    "city": "Prevost",
    "province": "QC"
  },
  {
    "firm": "ABC Evaluations Inc",
    "phone": "450.864.0173",
    "city": "Mont-Saint-Hilaire",
    "province": "QC"
  },
  {
    "firm": "Drimmex Evaluations Immobilieres Inc.",
    "phone": "514.773.3644",
    "city": "L'Ille-Perrot",
    "province": "QC"
  },
  {
    "firm": "Drouin Benoit Evaluations",
    "phone": "450.626.1156",
    "city": "Mont-St-Hilaire",
    "province": "QC"
  },
  {
    "firm": "Evaluation M.S.",
    "phone": "514.944.9421",
    "city": "Prairie",
    "province": "QC"
  },
  {
    "firm": "Evaluation Robert Parent",
    "phone": "450.585.7944",
    "city": "Repentigny",
    "province": "QC"
  },
  {
    "firm": "Evaluation SLN",
    "phone": "514.716.7950",
    "city": "Laurent",
    "province": "QC"
  },
  {
    "firm": "Gagnon Evaluateurs Agrees Inc",
    "phone": "418.026.4289",
    "city": "Levis",
    "province": "QC"
  },
  {
    "firm": "Immobec Inc",
    "phone": "418.473.5481",
    "city": "Quatre-Bourgeois",
    "province": "QC"
  },
  {
    "firm": "JSL Evaluation Inc",
    "phone": "",
    "city": "Beloeil",
    "province": "QC"
  },
  {
    "firm": "Les evaluations Bigras et Associes Inc",
    "phone": "450.420.6555",
    "city": "Terrebonne",
    "province": "QC"
  },
  {
    "firm": "MRC Evaluations",
    "phone": "514.241.2257",
    "city": "Pierrefonds",
    "province": "QC"
  },
  {
    "firm": "Nathalie Lapointe Evaluation Immobiliere",
    "phone": "514.691.1885",
    "city": "Carignan",
    "province": "QC"
  },
  {
    "firm": "Services D'Evaluations Visuelles Inc",
    "phone": "514.385.4417",
    "city": "Laval",
    "province": "QC"
  },
  {
    "firm": "Terra Pro Inc",
    "phone": "514.426.9281",
    "city": "Kirkland",
    "province": "QC"
  },
  {
    "firm": "Bona Fide Evaluateurs Agrees",
    "phone": "418.717.5933",
    "city": "Quebec",
    "province": "QC"
  },
  {
    "firm": "Evaluations Angelhart Appraisals Inc",
    "phone": "506.329.9000",
    "city": "Gaspe",
    "province": "QC"
  },
  {
    "firm": "Michel Paris Evaluation",
    "phone": "514.813.1758",
    "city": "Terrebonne",
    "province": "QC"
  },
  {
    "firm": "CDC Inc",
    "phone": "866.479.7922",
    "city": "West Montreal",
    "province": "QC"
  },
  {
    "firm": "Blue Zephyr Ltd",
    "phone": "306.380.5424",
    "city": "Eatonia",
    "province": "SK"
  },
  {
    "firm": "Blyth Agencies",
    "phone": "306.735.2266",
    "city": "Whitewood",
    "province": "SK"
  },
  {
    "firm": "Dream Home Appraisal Co.",
    "phone": "306.934.4455",
    "city": "Saskatoon SK",
    "province": "SK"
  },
  {
    "firm": "Fortier Matilla Appraisals Inc. Formerly Mattila Appraisals Ltd",
    "phone": "306.937.5073",
    "city": "North Battleford",
    "province": "SK"
  },
  {
    "firm": "Just North of Appraisals",
    "phone": "306.862.8875",
    "city": "Choiceland",
    "province": "SK"
  },
  {
    "firm": "McInnes & Company Appraisals",
    "phone": "306.825.3500",
    "city": "Lloydminster",
    "province": "SK"
  },
  {
    "firm": "Pinnacle Appraisals",
    "phone": "306.737.6960",
    "city": "Regina",
    "province": "SK"
  },
  {
    "firm": "Rolling Thunder Enterprises",
    "phone": "306.228.3477",
    "city": "Unity",
    "province": "SK"
  },
  {
    "firm": "Royal Lepage   Myrah Appraisals",
    "phone": "306.359.1625",
    "city": "Regina",
    "province": "SK"
  },
  {
    "firm": "Sutton Group Results Realty",
    "phone": "306.591.1222",
    "city": "Regina",
    "province": "SK"
  },
  {
    "firm": "United Appraisals",
    "phone": "306.764.3435",
    "city": "Prince Albert",
    "province": "SK"
  },
  {
    "firm": "Western Appraisals",
    "phone": "306.445.7248",
    "city": "North Battleford",
    "province": "SK"
  },
  {
    "firm": "Associated Appraisal Company",
    "phone": "306.934.2444",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "firm": "B.R. Gaffney",
    "phone": "306.359.7800",
    "city": "Regina",
    "province": "SK"
  },
  {
    "firm": "Brunsdon Lawrek & Associates",
    "phone": "306.244.5900",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "firm": "Craig E Hellings Appraisals",
    "phone": "306.694.0777",
    "city": "Moose Jaw",
    "province": "SK"
  },
  {
    "firm": "Cross Appraisals",
    "phone": "306.757.2101",
    "city": "Regina",
    "province": "SK"
  },
  {
    "firm": "Crown Appraisals",
    "phone": "306.359.3111",
    "city": "Regina",
    "province": "SK"
  },
  {
    "firm": "D.L. Hellings & Associates Ltd",
    "phone": "306.693.6700",
    "city": "Moosejaw",
    "province": "SK"
  },
  {
    "firm": "Fox Appraisal",
    "phone": "306.581.9919",
    "city": "Regina",
    "province": "SK"
  },
  {
    "firm": "Gordon Lawson Real Estate Appraisals & Consulting",
    "phone": "306.260.6007",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "firm": "La Reine Appraisals",
    "phone": "306.634.6388",
    "city": "Estevan",
    "province": "SK"
  },
  {
    "firm": "Myrah Appraisals",
    "phone": "306.359.1625",
    "city": "Regina",
    "province": "SK"
  },
  {
    "firm": "Ralph Courtnage Appraisals",
    "phone": "306.691.0493",
    "city": "Moose Jaw",
    "province": "SK"
  },
  {
    "firm": "Ring Appraisals Ltd",
    "phone": "306.922.8484",
    "city": "Prince Albert",
    "province": "SK"
  },
  {
    "firm": "Suncorp Valuations Ltd.",
    "phone": "306.652.0311",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "firm": "Warkentin Appraisers",
    "phone": "306.778.3231",
    "city": "Swift Current",
    "province": "SK"
  },
  {
    "firm": "Riverside Appraisal Ltd",
    "phone": "306.652.6636",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "firm": "Gerein Appraisals",
    "phone": "306.782.1765",
    "city": "Yorkton",
    "province": "SK"
  },
  {
    "firm": "Precision Appraisal Services",
    "phone": "306.752.4331",
    "city": "Melfort",
    "province": "SK"
  },
  {
    "firm": "C. Borsa Appraisals",
    "phone": "306.501.7603",
    "city": "Regina",
    "province": "SK"
  },
  {
    "firm": "Tri J Appraisals",
    "phone": "306.634.4963",
    "city": "Estevan",
    "province": "SK"
  },
  {
    "firm": "Michael Fox Valuations Inc",
    "phone": "306.775.3900",
    "city": "Regina",
    "province": "SK"
  },
  {
    "firm": "Dreamhome Appraisal Co Ltd",
    "phone": "",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "firm": "Korol Appraisals Ltd",
    "phone": "306.213.7137",
    "city": "Waksaw",
    "province": "SK"
  },
  {
    "firm": "Kamsol Elite Consultants Inc",
    "phone": "306.807.1133",
    "city": "Regina",
    "province": "SK"
  },
  {
    "firm": "Kaufmann Appraisals",
    "phone": "306.717.4231",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "firm": "Dynamic Appraisals",
    "phone": "306.220.9082",
    "city": "Warman",
    "province": "SK"
  },
  {
    "firm": "Parkland Valuations Inc",
    "phone": "306.782.4417",
    "city": "Yorkton",
    "province": "SK"
  },
  {
    "firm": "SUTY Consulting Inc.",
    "phone": "306.690.2669",
    "city": "Moose Jaw",
    "province": "SK"
  },
  {
    "firm": "CDC Inc",
    "phone": "866.479.7922",
    "city": "Regina",
    "province": "Sk"
  }
];

export const AVEO_APPROVED_APPRAISERS: DirectoryAppraiserItem[] = [
  {
    "name": "Chris Hall CRA, P.App",
    "firm": "A.R.C. Appraisal Consultants - Lethbridge",
    "address": "614 17 St SW",
    "city": "Medicine Hat",
    "province": "AB"
  },
  {
    "name": "Arthur Schwentner",
    "firm": "A.S. Appraisals & Consulting",
    "address": "Box 3466",
    "city": "Wainwright",
    "province": "AB"
  },
  {
    "name": "Christina Sieben, CRA",
    "firm": "Abbott-Brown Appraisals",
    "address": "10114 89 Street",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "name": "Jacob Slabbert, CRA",
    "firm": "Accord Appraisal Company",
    "address": "4825 51 St",
    "city": "Camrose",
    "province": "AB"
  },
  {
    "name": "Accumark Appraisals Ltd",
    "firm": "Accumark Appraisals Ltd",
    "address": "Suite 748, 104-743 Railway Avenue",
    "city": "Canmore",
    "province": "AB"
  },
  {
    "name": "Accupro Real Estate Appraisal & Consulting",
    "firm": "Accupro Real Estate Appraisal & Consulting",
    "address": "10032-103 Avenue",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "name": "Advantage Valuation Group Inc.",
    "firm": "Advantage Valuation Group Inc.",
    "address": "2204 - 7 Street NE",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Alberta Property Appraisals Ltd.",
    "firm": "Alberta Property Appraisals Ltd.",
    "address": "#201-11813-123 Street",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "All Property Appraisals Ltd",
    "firm": "All Property Appraisals Ltd",
    "address": "31 Carr Crescent S.E.",
    "city": "Medicine Hat",
    "province": "AB"
  },
  {
    "name": "Jim Abelseth, CRA",
    "firm": "Apex Appraisal Service",
    "address": "Box 2354",
    "city": "Banff",
    "province": "AB"
  },
  {
    "name": "Appraisal Solutions Inc",
    "firm": "Appraisal Solutions Inc",
    "address": "# 2 1713 - 2 Ave. South",
    "city": "Lethbridge",
    "province": "AB"
  },
  {
    "name": "Atkinson & Associates",
    "firm": "Atkinson & Associates",
    "address": "204 - 5920 McLeod Trail South",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Atlas Appraisal Services",
    "firm": "Atlas Appraisal Services",
    "address": "5014 - 50 Avenue",
    "city": "Lloydminster",
    "province": "AB"
  },
  {
    "name": "Avison Young Valuation (aka AVSN Appraisal Group)",
    "firm": "Avison Young Valuation (aka AVSN Appraisal Group)",
    "address": "802, 1039 17th Ave. SW",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Cassidy MacDonald, AACI, P.App",
    "firm": "Balance Valuations Ltd.",
    "address": "101, 10126 120 Ave",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "name": "Lorna Sarah, CRA",
    "firm": "Bedrock Appraisals",
    "address": "Greentree Mall",
    "city": "Drumheller",
    "province": "AB"
  },
  {
    "name": "Randall Stegemann DAC",
    "firm": "Benchmark Real Estate Appraisals Ltd.",
    "address": "#206, 2750- 22 St NE",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Spencer Betterson, CRA",
    "firm": "Bettenson Appraisals",
    "address": "7002 85th Street",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "name": "Frances Biegel, CRA",
    "firm": "Biegel & Perra Appraisals",
    "address": "102-9715 105 St",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "name": "Darren Black",
    "firm": "Black Valuation Group Ltd.",
    "address": "PO Box 5159",
    "city": "Airdrie",
    "province": "AB"
  },
  {
    "name": "BNN Appraisals",
    "firm": "BNN Appraisals",
    "address": "315 Shawinigan Place SW",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Bulbeck Appraisal Ltd.",
    "firm": "Bulbeck Appraisal Ltd.",
    "address": "Box 1431",
    "city": "Drumheller",
    "province": "AB"
  },
  {
    "name": "Rhonda George, DAR",
    "firm": "By George Appraisals",
    "address": "17543 91 Street",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "Calgary Independent Appraisals",
    "firm": "Calgary Independent Appraisals",
    "address": "208, 3907 - 3A Street NE",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "CAMA Real Estate Appraisals Ltd",
    "firm": "CAMA Real Estate Appraisals Ltd",
    "address": "Box 1198",
    "city": "Sundre",
    "province": "AB"
  },
  {
    "name": "Capital Region Real Estate Consulting Ltd.",
    "firm": "Capital Region Real Estate Consulting Ltd.",
    "address": "Box 53076 RPO Glenora",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "Cartwright Appraisals",
    "firm": "Cartwright Appraisals",
    "address": "#232, 4144A -97 Street",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "Curtis Cossey, AACI",
    "firm": "CDC Consulting Services Inc.",
    "address": "193 Athabascan Avenue",
    "city": "Sherwood Park",
    "province": "AB"
  },
  {
    "name": "Nathan Lehman, CRA",
    "firm": "Cenalta Appraisals",
    "address": "",
    "city": "Red Deer",
    "province": "AB"
  },
  {
    "name": "Chalifour Denis & Associates",
    "firm": "Chalifour Denis & Associates",
    "address": "302 - 8706 Franklin Ave",
    "city": "Fort McMurray",
    "province": "AB"
  },
  {
    "name": "City Appraisals",
    "firm": "City Appraisals",
    "address": "239 Perry Crescent",
    "city": "Medicine Hat",
    "province": "AB"
  },
  {
    "name": "Michael Chekaluk, DAR",
    "firm": "Cityline Appraisals Inc",
    "address": "PO Box 4561",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "Jim Crews, CRA",
    "firm": "Cornerstone Appraisals Inc.",
    "address": "94 Cougar Ridge Cres SW",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Darmac Appraisals Ltd",
    "firm": "Darmac Appraisals Ltd",
    "address": "5102-48th Street",
    "city": "Lloydminister",
    "province": "AB"
  },
  {
    "name": "DCR Appraisal",
    "firm": "DCR Appraisal",
    "address": "312, 204 17 street east",
    "city": "Brooks",
    "province": "AB"
  },
  {
    "name": "Eagleson, Ho & Associates",
    "firm": "Eagleson, Ho & Associates",
    "address": "55 Canata Close SW",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Elite Appraisals",
    "firm": "Elite Appraisals",
    "address": "7715 Bowcliffe Cres. NW",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Robert Johnson, CRA",
    "firm": "EM Johnson Appraisals",
    "address": "Box 17 Site 130 RR4",
    "city": "Rocky Mountain House",
    "province": "AB"
  },
  {
    "name": "Sehim Ergil, AACI, P.App & Katherine Hudson, CRA",
    "firm": "Ergil Bains & Associates Ltd.",
    "address": "#51, 9912-106 Street",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "Fletcher's Appraisal Services",
    "firm": "Fletcher's Appraisal Services",
    "address": "#3, 6604 - 82nd Avenue",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "Trevor Frost, CRA",
    "firm": "Frost & Associates Realty Services Inc",
    "address": "#150, 17510 107 Avenue",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "Great West Appraisals Inc.",
    "firm": "Great West Appraisals Inc.",
    "address": "138 Hubman Landing",
    "city": "Canmore",
    "province": "AB"
  },
  {
    "name": "Halvorsen Fedynak & Company",
    "firm": "Halvorsen Fedynak & Company",
    "address": "10525, 170 Street suite 170",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "Greg Bowker, CRA",
    "firm": "HarrisonBowker Real Estate Appraisers Ltd.",
    "address": "200, 37 St. Thomas Street",
    "city": "St. Albert",
    "province": "AB"
  },
  {
    "name": "Don Hubbs, CRA",
    "firm": "Hubbs R. E. Appraisals",
    "address": "355, 3132 26 Street NE",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "J & E Appraisal Services",
    "firm": "J & E Appraisal Services",
    "address": "#52288, 311 - 16 Avenue NE",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Gregory Bowker, CRA",
    "firm": "Jackson Real Estate Appraisals Ltd.",
    "address": "Suite 2020, Tower 1 Soctia Place 10060 Jasper Ave",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "Kate Rung, CRA",
    "firm": "Kate Rung & Associates",
    "address": "4826 - 50 Street",
    "city": "Olds",
    "province": "AB"
  },
  {
    "name": "Kennedy Appraisals Ltd",
    "firm": "Kennedy Appraisals Ltd",
    "address": "4405 59th Street",
    "city": "Beaumont",
    "province": "AB"
  },
  {
    "name": "Stephanie Church",
    "firm": "Kerrigan & Company",
    "address": "619 - 8600 Franklin Ave",
    "city": "Fort McMurray",
    "province": "AB"
  },
  {
    "name": "Derek Van Lersberghe, AACI P.App  /  Stephen Healey, CRA",
    "firm": "Knight & Company Appraisals",
    "address": "202 - 10441 - 178 Street",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "Landucation Consulting Ltd",
    "firm": "Landucation Consulting Ltd",
    "address": "243 Lakeshore Drive",
    "city": "Island Lake",
    "province": "AB"
  },
  {
    "name": "Chantelle Haugrud",
    "firm": "Lawrenson Walker Appraisers",
    "address": "510, 214 11 Avenue SW",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "James Schoenne, AACI",
    "firm": "Lethbridge Property Appraisal Inc.",
    "address": "406-740 4TH Ave",
    "city": "Lethbridge",
    "province": "AB"
  },
  {
    "name": "M.I.T. Appraisals Ltd.",
    "firm": "M.I.T. Appraisals Ltd.",
    "address": "5503-52 Street",
    "city": "Lloydminster",
    "province": "AB"
  },
  {
    "name": "Christopher Mackie, CRA, P.App",
    "firm": "Mackie Valuations Inc.",
    "address": "12 Lyle Close",
    "city": "Sylvan Lake",
    "province": "AB"
  },
  {
    "name": "New Market Appraisals Ltd.",
    "firm": "New Market Appraisals Ltd.",
    "address": "55 Sun Harbour Road SE",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Northern Lights Real Estate Consulting Ltd.",
    "firm": "Northern Lights Real Estate Consulting Ltd.",
    "address": "6417-112 Ave",
    "city": "Edmonton",
    "province": "AB"
  },
  {
    "name": "Perry Appraisal Associates",
    "firm": "Perry Appraisal Associates",
    "address": "4801-49 Ave",
    "city": "Olds",
    "province": "AB"
  },
  {
    "name": "Plant & Associates - AB",
    "firm": "Plant & Associates - AB",
    "address": "9924 - 108th Ave",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "name": "Patrick Pomeroy, AACI,P.App",
    "firm": "PVG Real Estate Valutaions & Consulting",
    "address": "204, 10009-101 Avenue",
    "city": "Grande Prairie",
    "province": "AB"
  },
  {
    "name": "Quinn & Company Appraisals Ltd",
    "firm": "Quinn & Company Appraisals Ltd",
    "address": "Box 6136",
    "city": "Fort McMurray",
    "province": "AB"
  },
  {
    "name": "Ali Naseem, AACI",
    "firm": "Raaziq Appraisals Ltd",
    "address": "6383 Ranchview Driver NW",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Richard D. Sieben",
    "firm": "RDS Appraisal Group, formerly Anadyr Property Appraisals",
    "address": "166 Rocky Vista Circle NW",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Dana Carroll, CRA",
    "firm": "Red Deer Appraisals Ltd.",
    "address": "142 Connaught Cres",
    "city": "Red Deer",
    "province": "AB"
  },
  {
    "name": "Reliance Appraisal Consultants Ltd.",
    "firm": "Reliance Appraisal Consultants Ltd.",
    "address": "201 - 1122 - 3rd Ave S",
    "city": "Lethbridge",
    "province": "AB"
  },
  {
    "name": "Roy Somers Appraisals",
    "firm": "Roy Somers Appraisals",
    "address": "PO Box 83",
    "city": "Worsley",
    "province": "AB"
  },
  {
    "name": "Scott Taylor",
    "firm": "S.D. Taylor & Company",
    "address": "472 Douglasbank Crt SE",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Jay Boville, CRA, P.App",
    "firm": "Sage Appraisals",
    "address": "RPO North Hill Box 65117",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Lorie Simmerson DAR",
    "firm": "Simmerson Appraisal Services",
    "address": "4831-56 Av",
    "city": "Innisfail",
    "province": "AB"
  },
  {
    "name": "Slavik McCartney Appraisals",
    "firm": "Slavik McCartney Appraisals",
    "address": "5018 - 3th Avenue Box 7646,",
    "city": "Edson",
    "province": "AB"
  },
  {
    "name": "Soderquist Appraisals",
    "firm": "Soderquist Appraisals",
    "address": "303, 4901 - 48 Street",
    "city": "Red Deer",
    "province": "AB"
  },
  {
    "name": "Squair Appraisals & Consulting",
    "firm": "Squair Appraisals & Consulting",
    "address": "Box 154",
    "city": "Clyde",
    "province": "AB"
  },
  {
    "name": "Kevin Steckler, AACI, P.App, B. Ed",
    "firm": "Steckler Real Estate Appraisals",
    "address": "39 Falcon Crescent",
    "city": "Sylvan Lake",
    "province": "AB"
  },
  {
    "name": "Diane Beisel, CRA",
    "firm": "Stettler Appraisals",
    "address": "Box 1101",
    "city": "Stettler",
    "province": "AB"
  },
  {
    "name": "Stone Appraisals",
    "firm": "Stone Appraisals",
    "address": "P.O. Box 1155",
    "city": "Manning",
    "province": "AB"
  },
  {
    "name": "Annette Krusnitzky, DAR",
    "firm": "SwanCo Appraisals",
    "address": "",
    "city": "Spruce Grove",
    "province": "AB"
  },
  {
    "name": "Tru Appraisals Ltd.",
    "firm": "Tru Appraisals Ltd.",
    "address": "2530-12th Ave SE",
    "city": "Medicine Hat",
    "province": "AB"
  },
  {
    "name": "Ryan Ramage, CRA",
    "firm": "True Value Appraisals Inc.",
    "address": "30 Cougar Ridge Rise SW",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "David Horn, AACI, P.App",
    "firm": "TruePoint Appraisals",
    "address": "103-251 Spruce Street",
    "city": "Red Deer County",
    "province": "AB"
  },
  {
    "name": "Val Appraisals",
    "firm": "Val Appraisals",
    "address": "4915 - 50 Ave",
    "city": "Bonnyville",
    "province": "AB"
  },
  {
    "name": "Wainwright Assessment Group",
    "firm": "Wainwright Assessment Group",
    "address": "602 - 10th Street",
    "city": "Wainwright",
    "province": "AB"
  },
  {
    "name": "Harold Weidman, CAR",
    "firm": "Weidman Reliance Group Inc",
    "address": "130, 15 Royal Vista Way NW",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Tabitha Suitor, DAR",
    "firm": "Wildrose Appraisals",
    "address": "Box 1077",
    "city": "Sundre",
    "province": "AB"
  },
  {
    "name": "Zindler & Associates",
    "firm": "Zindler & Associates",
    "address": "414 - 8989 Macleod Trail S",
    "city": "Calgary",
    "province": "AB"
  },
  {
    "name": "Accredited Appraisals Ltd",
    "firm": "Accredited Appraisals Ltd",
    "address": "255 Second St",
    "city": "Duncan",
    "province": "BC"
  },
  {
    "name": "Adam Lawrenson, AACI, P.App",
    "firm": "Adlaw Appraisals Ltd.",
    "address": "3849 Clark Dr",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "name": "Jason Upton, CRA",
    "firm": "Aedis Appraisals",
    "address": "#200-1687 West Broadway",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "name": "All Equity Appraisals Ltd",
    "firm": "All Equity Appraisals Ltd",
    "address": "1635 Gillard Drive",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "name": "Warren Wurzer, CRA",
    "firm": "Alpha Appraisals",
    "address": "",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "name": "Angelica Real Estate Advisory Services",
    "firm": "Angelica Real Estate Advisory Services",
    "address": "Box 3253",
    "city": "Garibaldi Highlands",
    "province": "BC"
  },
  {
    "name": "Appraisals North West",
    "firm": "Appraisals North West",
    "address": "204 - 4650 Lazelle Ave",
    "city": "Terrace",
    "province": "BC"
  },
  {
    "name": "Associated Appraisers",
    "firm": "Associated Appraisers",
    "address": "Box 3685",
    "city": "Courtenay",
    "province": "BC"
  },
  {
    "name": "Dixie Delves, CRA",
    "firm": "Associated Appraisers - Campbell River",
    "address": "Station A, Box 115",
    "city": "Campbell River",
    "province": "BC"
  },
  {
    "name": "Astro Appraisals",
    "firm": "Astro Appraisals",
    "address": "331 St. Julian St",
    "city": "Duncan",
    "province": "BC"
  },
  {
    "name": "A-Teck Appraisals Ltd",
    "firm": "A-Teck Appraisals Ltd",
    "address": "3255 Upper Fraser Rd",
    "city": "Prince George",
    "province": "BC"
  },
  {
    "name": "Cameron Dinning, AACI,P.App.   James Doersam, CRA",
    "firm": "Baker & Osland Appraisal Ltd.",
    "address": "109-3550 Saanich Rd.",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "name": "Bakerview Realty Appraisals",
    "firm": "Bakerview Realty Appraisals",
    "address": "15577 37A Avenue",
    "city": "Surrey",
    "province": "BC"
  },
  {
    "name": "Richard Osland, CRA",
    "firm": "Bayline Real Estate Ltd.",
    "address": "268 Magic Dr",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "name": "Benson Appraisals",
    "firm": "Benson Appraisals",
    "address": "#107 - 30 Cavan St.",
    "city": "Nanaimo",
    "province": "BC"
  },
  {
    "name": "Robert Godfrey, CRA",
    "firm": "C.H. Godfrey Appraisals Ltd.",
    "address": "1533 - 7 Ave",
    "city": "Primce George",
    "province": "BC"
  },
  {
    "name": "Campbell & Pound",
    "firm": "Campbell & Pound",
    "address": "1111-11872 Horseshow Way",
    "city": "Richmond",
    "province": "BC"
  },
  {
    "name": "Coast Appraisals",
    "firm": "Coast Appraisals",
    "address": "101, 2220 Sooke Road",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "name": "Coast Wide Appraisals",
    "firm": "Coast Wide Appraisals",
    "address": "PO Box 1367",
    "city": "Gibsons",
    "province": "BC"
  },
  {
    "name": "Simon Kwan, CRA, P. App, CRP",
    "firm": "Conviare Real Estate Appraisers",
    "address": "#600-1200 West 73rd Ave",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "name": "Amanda Corrie, CRA",
    "firm": "Corrie Appraisals",
    "address": "Box 822",
    "city": "Salmon Arm",
    "province": "BC"
  },
  {
    "name": "Creston Valley Appraisals",
    "firm": "Creston Valley Appraisals",
    "address": "Box 425",
    "city": "Creston",
    "province": "BC"
  },
  {
    "name": "Cunningham & Rivard Appraisals (Campbell River)",
    "firm": "Cunningham & Rivard Appraisals (Campbell River)",
    "address": "105 - 300 St. Ann's Road",
    "city": "Campbell River",
    "province": "BC"
  },
  {
    "name": "Cunningham & Rivard Appraisals (Nanaimo/Duncan/Victoria)",
    "firm": "Cunningham & Rivard Appraisals (Nanaimo/Duncan/Victoria)",
    "address": "70 Prideaux Street",
    "city": "Nanaimo",
    "province": "BC"
  },
  {
    "name": "D Fritz Appraisals",
    "firm": "D Fritz Appraisals",
    "address": "840 Royal Oak Ave",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "name": "Mark Elliott, DAR",
    "firm": "Elliott Appraisals",
    "address": "104-1015 Columbia St",
    "city": "New Westminster",
    "province": "BC"
  },
  {
    "name": "Farnsworth Appraisals Ltd.",
    "firm": "Farnsworth Appraisals Ltd.",
    "address": "631 Laurier Drive",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "name": "Brad Fast, AIC",
    "firm": "Fast Appraisals",
    "address": "5078 Bentley Drive",
    "city": "Delta",
    "province": "BC"
  },
  {
    "name": "Fernie Appraisals Ltd.",
    "firm": "Fernie Appraisals Ltd.",
    "address": "561A Highway 3",
    "city": "Fernie",
    "province": "BC"
  },
  {
    "name": "Finden Appraisals",
    "firm": "Finden Appraisals",
    "address": "385 Winnipeg St.",
    "city": "Prince George",
    "province": "BC"
  },
  {
    "name": "Flynn Mirtle Moran Appraisers",
    "firm": "Flynn Mirtle Moran Appraisers",
    "address": "207 - 310 Nicola Street",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "name": "Fraser Valley Appraisals",
    "firm": "Fraser Valley Appraisals",
    "address": "22-8337 Young Road",
    "city": "Chilliwack",
    "province": "BC"
  },
  {
    "name": "Fraserway Appraisal Ltd.",
    "firm": "Fraserway Appraisal Ltd.",
    "address": "104-2760 Trethwey Street",
    "city": "Abobotsford",
    "province": "BC"
  },
  {
    "name": "Frilan Appraisals",
    "firm": "Frilan Appraisals",
    "address": "469 St. Paul Street",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "name": "Gregory Marken, CRA",
    "firm": "G. W. Marken Appraisal",
    "address": "Suite 2, 405 Baker Street",
    "city": "Nelson",
    "province": "BC"
  },
  {
    "name": "Gobin Appraisals",
    "firm": "Gobin Appraisals",
    "address": "P.O. Box 29150 - 1950 W. Broadway",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "name": "Golden Ears Appraisals",
    "firm": "Golden Ears Appraisals",
    "address": "200 21050 123  Ave",
    "city": "Maple Ridge",
    "province": "BC"
  },
  {
    "name": "Brad Cable, DAR",
    "firm": "Great West Appraisals Inc. (AKA, Kicking Horse Appraisals)",
    "address": "PO Box 328",
    "city": "Invermere",
    "province": "BC"
  },
  {
    "name": "Craig Hennigar, AACI",
    "firm": "Hennigar & Associates Consulting",
    "address": "20070 Grade Crescent",
    "city": "Langley",
    "province": "BC"
  },
  {
    "name": "Jagmohan Turna, CRA",
    "firm": "Highland Appraisals Inc",
    "address": "8239 171 ST",
    "city": "Surrey",
    "province": "BC"
  },
  {
    "name": "IKD Appraisal Services Lrd.",
    "firm": "IKD Appraisal Services Lrd.",
    "address": "1641 Brunt Drive",
    "city": "Nanoose Bay",
    "province": "BC"
  },
  {
    "name": "Iain Hyslop, AACI",
    "firm": "Inland Appraisers Ltd.",
    "address": "208 Main Street",
    "city": "Penticton",
    "province": "BC"
  },
  {
    "name": "Intercity Appraisals",
    "firm": "Intercity Appraisals",
    "address": "6203 - 2850 Shaughnessy Street",
    "city": "Port Coquitlam",
    "province": "BC"
  },
  {
    "name": "Isle West Appraisals",
    "firm": "Isle West Appraisals",
    "address": "2603 Cosgrove Cres",
    "city": "Nannaimo",
    "province": "BC"
  },
  {
    "name": "J K Wheeldon Appraisals Ltd",
    "firm": "J K Wheeldon Appraisals Ltd",
    "address": "25 - 10 Ave S",
    "city": "Cranbrook",
    "province": "BC"
  },
  {
    "name": "John Vanwoerkom, CRA",
    "firm": "John VanWoerkom",
    "address": "5253 57A Street",
    "city": "Delta",
    "province": "BC"
  },
  {
    "name": "Kirk Appraisals Ltd.",
    "firm": "Kirk Appraisals Ltd.",
    "address": "202-6955 120th street",
    "city": "Delta",
    "province": "BC"
  },
  {
    "name": "Richard Kohlen, CRA",
    "firm": "Kohlen & Company",
    "address": "302-35 - 2nd Ave S",
    "city": "Williams Lake",
    "province": "BC"
  },
  {
    "name": "Martin Kors, AACI",
    "firm": "Kors & Associates",
    "address": "201-739 Kings Road",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "name": "Kutyn Property Services",
    "firm": "Kutyn Property Services",
    "address": "1819 Beaufort Avenue # 301",
    "city": "Comox",
    "province": "BC"
  },
  {
    "name": "Landquest Appraisals Ltd.",
    "firm": "Landquest Appraisals Ltd.",
    "address": "11219 102 St",
    "city": "Fort St. John",
    "province": "BC"
  },
  {
    "name": "Lawrenson Walker Realty Advisors Ltd",
    "firm": "Lawrenson Walker Realty Advisors Ltd (AKA Lawrenson Walker Real Estate Appraisers Ltd.)",
    "address": "#200 - 1678 - 128 Street",
    "city": "Surrey",
    "province": "BC"
  },
  {
    "name": "Leemore & Associates",
    "firm": "Leemore & Associates",
    "address": "B3 - 1410 Parkway Blvd",
    "city": "Coquitlam",
    "province": "BC"
  },
  {
    "name": "Eric Linquist, CRA, P.APP",
    "firm": "Linquist Real Estate Appraisal",
    "address": "3266 St. Johns Street",
    "city": "Port Moody",
    "province": "BC"
  },
  {
    "name": "Lower Mainland Appraisal Services",
    "firm": "Lower Mainland Appraisal Services",
    "address": "#8 - 3034 Edgemont Blvd",
    "city": "North Vancouver",
    "province": "BC"
  },
  {
    "name": "Macintosh Appraisals",
    "firm": "Macintosh Appraisals",
    "address": "401-555 Sixth Street",
    "city": "New Westminster",
    "province": "BC"
  },
  {
    "name": "Paul Magee, CRA",
    "firm": "Magee Appraisals",
    "address": "#73-658 Alderwood Drive",
    "city": "Ladysmith",
    "province": "BC"
  },
  {
    "name": "McDonald Appraisals Inc.",
    "firm": "McDonald Appraisals Inc.",
    "address": "Box 6576",
    "city": "Fort St John",
    "province": "BC"
  },
  {
    "name": "Ian McIntosh, CRA",
    "firm": "McIntosh Appraisals & Consulting",
    "address": "PO BOX  459",
    "city": "Invermere",
    "province": "BC"
  },
  {
    "name": "Kris Meisterman, CRA",
    "firm": "Meisterman Appraisals",
    "address": "#270 - 12420 No. 1 Road",
    "city": "Richmond",
    "province": "BC"
  },
  {
    "name": "Michael Harley, CRA",
    "firm": "Michael Harley & Associates",
    "address": "10959 Eva Road",
    "city": "Lake Country",
    "province": "BC"
  },
  {
    "name": "Mills Appraisal Group Ltd.",
    "firm": "Mills Appraisal Group Ltd.",
    "address": "103- 4430 Chatterton Way",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "name": "Nearhood Appraisal Services Ltd.",
    "firm": "Nearhood Appraisal Services Ltd.",
    "address": "#201, 9711-100th Avenue",
    "city": "Fort St. John",
    "province": "BC"
  },
  {
    "name": "Nicam Appraisals Inc.",
    "firm": "Nicam Appraisals Inc.",
    "address": "1112 Duncan Ave. E",
    "city": "Penticton",
    "province": "BC"
  },
  {
    "name": "Michael LaPorte, AACI, P.App",
    "firm": "Niemi La Porte & Dowle",
    "address": "312 - 8678 Greenall Avenue",
    "city": "Burnaby",
    "province": "BC"
  },
  {
    "name": "Christine Traynor, CRA",
    "firm": "Niemi La Porte & Dowle - Victoria",
    "address": "100-1803 Douglas St",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "name": "Terry  Dowle, AACI",
    "firm": "Niemi La Porte & Dowle Whistler Appraisals Ltd.",
    "address": "312 - 8678 Greenall Ave",
    "city": "Burnaby",
    "province": "BC"
  },
  {
    "name": "North Cariboo Appraisals Ltd",
    "firm": "North Cariboo Appraisals Ltd",
    "address": "458 B Reid Street",
    "city": "Quesnel",
    "province": "BC"
  },
  {
    "name": "Denise Smith, AACI",
    "firm": "North Isle Appraisals",
    "address": "Box 31",
    "city": "Heriot Bay",
    "province": "BC"
  },
  {
    "name": "Chris Roworth",
    "firm": "Okanagan Appraisals Ltd.  (AKA:  Aedis Okanagan Services Inc. )",
    "address": "203-1180 Sunset Dr",
    "city": "Kelowna",
    "province": "BC"
  },
  {
    "name": "Okanagan North Appraisal Services 2015",
    "firm": "Okanagan North Appraisal Services 2015",
    "address": "#102, 3131 - 29th Street",
    "city": "Vernon",
    "province": "BC"
  },
  {
    "name": "Pacific Rim Appraisals Ltd.",
    "firm": "Pacific Rim Appraisals Ltd.",
    "address": "#2-57 Skinner Street",
    "city": "Nanaimo",
    "province": "BC"
  },
  {
    "name": "Pacific West Appraisals",
    "firm": "Pacific West Appraisals",
    "address": "3190 E. 2nd Avenue",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "name": "Louise Mcgee, DAR",
    "firm": "Palmer Appraisal Ltd.",
    "address": "2244 Kinross Ave",
    "city": "Victoria",
    "province": "BC"
  },
  {
    "name": "Garry Doucette, AACI",
    "firm": "PCAG Property Advisors Inc.",
    "address": "3581 Bishop Cr.",
    "city": "Port Alberni",
    "province": "BC"
  },
  {
    "name": "Ed Landry, AACI, P.App",
    "firm": "Penny & Keenleyside Appraisals (AKA Collingwood Appraisals)",
    "address": "Unit 1-10318 Whalley Boulevard",
    "city": "Surrey",
    "province": "BC"
  },
  {
    "name": "Peter Ryks Property Services Ltd",
    "firm": "Peter Ryks Property Services Ltd",
    "address": "1437 Markay Drive",
    "city": "Vanderhoof",
    "province": "BC"
  },
  {
    "name": "Plant & Associates - BC",
    "firm": "Plant & Associates - BC",
    "address": "1101 - 103rd Ave",
    "city": "Dawson Creek",
    "province": "BC"
  },
  {
    "name": "Randy Ponti, CRA",
    "firm": "Ponti Appraisals",
    "address": "184 Robson Dr",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "name": "Michael Mayhew, AACI,P.App",
    "firm": "Precision Appraisal Group",
    "address": "301 Curtis Road",
    "city": "Comox",
    "province": "BC"
  },
  {
    "name": "Rick Graff, CRA",
    "firm": "Princeton Appraisals",
    "address": "325 K View Crescent",
    "city": "Keremeos",
    "province": "BC"
  },
  {
    "name": "Revelstoke Appraisals Ltd",
    "firm": "Revelstoke Appraisals Ltd",
    "address": "1876 Colbeck Rd",
    "city": "Revelstoke",
    "province": "BC"
  },
  {
    "name": "Rivard & Associates",
    "firm": "Rivard & Associates",
    "address": "#202, 2907 32nd Street",
    "city": "Vernon",
    "province": "BC"
  },
  {
    "name": "Ron McLeod, DAR",
    "firm": "RMC Appraisals",
    "address": "Box 404",
    "city": "Pouce Coupe",
    "province": "BC"
  },
  {
    "name": "Rocky Mountain Appraisals",
    "firm": "Rocky Mountain Appraisals",
    "address": "1909 12St S.",
    "city": "Cranbrook",
    "province": "BC"
  },
  {
    "name": "Rod Schenoni, CRA",
    "firm": "Schenoni & Associates Inc.",
    "address": "8149 - 156A Street",
    "city": "Surrey",
    "province": "BC"
  },
  {
    "name": "Schoenne & Associates",
    "firm": "Schoenne & Associates",
    "address": "3105 Suite G 31st Avenue",
    "city": "Vernon",
    "province": "BC"
  },
  {
    "name": "Schoenne Appraisals",
    "firm": "Schoenne Appraisals",
    "address": "101-144 Front Street",
    "city": "Penticton",
    "province": "BC"
  },
  {
    "name": "South Cariboo Appraisals Ltd",
    "firm": "South Cariboo Appraisals Ltd",
    "address": "Box 1289",
    "city": "100 Mile House",
    "province": "BC"
  },
  {
    "name": "South Okanagan Appraisals",
    "firm": "South Okanagan Appraisals",
    "address": "105-301 Main Street",
    "city": "Penticton",
    "province": "BC"
  },
  {
    "name": "Stephen Cullis, AACI, P.App",
    "firm": "Steve Cullis Appraisals Ltd.",
    "address": "2-2823 Clark St",
    "city": "Terrace",
    "province": "BC"
  },
  {
    "name": "Strand & Godfrey Appraisals Ltd.",
    "firm": "Strand & Godfrey Appraisals Ltd.",
    "address": "903B 4th Street",
    "city": "Castlegar",
    "province": "BC"
  },
  {
    "name": "Gord French, AACI, P.App",
    "firm": "Summit Appraisal & Consulting Ltd.",
    "address": "1199 Bay Avenue, Unit 202",
    "city": "Trail",
    "province": "BC"
  },
  {
    "name": "Jonathan Hubert, CRA",
    "firm": "Surrey Home Appraisals Ltd",
    "address": "Box #218, 102 - 15910 Fraser Hwy",
    "city": "Surrey",
    "province": "BC"
  },
  {
    "name": "TDC Realty Appraisers",
    "firm": "TDC Realty Appraisers",
    "address": "#201, 14756 Thrift Avenue",
    "city": "White Rock",
    "province": "BC"
  },
  {
    "name": "Thompson Rivers Appraisals Inc",
    "firm": "Thompson Rivers Appraisals Inc",
    "address": "919 Dominion Street",
    "city": "Kamloops",
    "province": "BC"
  },
  {
    "name": "Jon Vooys, CRA",
    "firm": "Urban Valley Appraisals",
    "address": "P.O. Box 333, Stn A",
    "city": "Abbotsford",
    "province": "BC"
  },
  {
    "name": "David Matthews, CRA",
    "firm": "Walton Appraisals Ltd",
    "address": "PO Box 3111",
    "city": "Garibaldi Highlands",
    "province": "BC"
  },
  {
    "name": "Wertz Appraisals",
    "firm": "Wertz Appraisals",
    "address": "Box 2088",
    "city": "Smithers",
    "province": "BC"
  },
  {
    "name": "Westech Appraisal Services Ltd.",
    "firm": "Westech Appraisal Services Ltd.",
    "address": "411-197 Forester Street",
    "city": "North Vancouver",
    "province": "BC"
  },
  {
    "name": "Sandy Sharma, CRA",
    "firm": "Westside Appraisals Inc.",
    "address": "8726 Barnard St",
    "city": "Vancouver",
    "province": "BC"
  },
  {
    "name": "Jacob Zaikow, CRA",
    "firm": "Zaikow Agencies (Westview Realty)",
    "address": "4471 Joyce Ave",
    "city": "Powell River",
    "province": "BC"
  },
  {
    "name": "Arthur McCoubrey",
    "firm": "A.L. McCoubrey & Associates",
    "address": "14 Marksbridge Drive",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Tyler Odell, CRA",
    "firm": "Acclaimed Appraisal Group",
    "address": "77 Moore Avenue",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Brandon Burley, CRA",
    "firm": "Agassiz Appraisals Inc.",
    "address": "312 - 6th St",
    "city": "Winkler",
    "province": "MB"
  },
  {
    "name": "Alana  Jennings Coutts, CRA",
    "firm": "AJC Appraisals",
    "address": "22 Alenbrook Bay",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Booth Cowie Appraisals",
    "firm": "Booth Cowie Appraisals",
    "address": "352 10th St.",
    "city": "Brandon",
    "province": "MB"
  },
  {
    "name": "Brad Carefoot",
    "firm": "Brad Carefoot",
    "address": "Box 1033",
    "city": "Dauphin",
    "province": "MB"
  },
  {
    "name": "Burley Appraisal Associates",
    "firm": "Burley Appraisal Associates",
    "address": "207, 3336 Portage Avenue",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "C.W. Appraisals",
    "firm": "C.W. Appraisals",
    "address": "3 Benson Boulevard",
    "city": "Oak Bluff",
    "province": "MB"
  },
  {
    "name": "Cherie Langston, CRA",
    "firm": "CL Appraisals",
    "address": "1 Lakeview Drive",
    "city": "Brandon",
    "province": "MB"
  },
  {
    "name": "David Park",
    "firm": "David Park",
    "address": "33 Elmdale Blvd",
    "city": "Brandon",
    "province": "MB"
  },
  {
    "name": "Dennis T. Browaty & Assoc",
    "firm": "Dennis T. Browaty & Assoc",
    "address": "565 - 167 Lombard Ave",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Dwayne Grantham, CRA, P. App",
    "firm": "Grantham Appraisal Service",
    "address": "Box 1387",
    "city": "Stonewall",
    "province": "MB"
  },
  {
    "name": "Halladay Appraisal Services Ltd",
    "firm": "Halladay Appraisal Services Ltd",
    "address": "Ste 262, 23 - 845 Dakota St",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Herb Jaques",
    "firm": "Herb Jaques",
    "address": "1359 Gordon Avenue",
    "city": "The Pas",
    "province": "MB"
  },
  {
    "name": "Hink Appraisals",
    "firm": "Hink Appraisals",
    "address": "28 Hermitage Rd",
    "city": "Headingley",
    "province": "MB"
  },
  {
    "name": "Dean Jordan, AACI",
    "firm": "Jordan Appraisal Group",
    "address": "44 2nd Avenue SE, Box 336",
    "city": "Minnedosa",
    "province": "MB"
  },
  {
    "name": "Kemp Appraisals Ltd.",
    "firm": "Kemp Appraisals Ltd.",
    "address": "162-2025 Corydon Ave., Suite 71",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "LS Appraisals & Consulting Services",
    "firm": "LS Appraisals & Consulting Services",
    "address": "Box 4, Grp 11A, R R 1",
    "city": "Richer",
    "province": "MB"
  },
  {
    "name": "MacKenzie & Associates",
    "firm": "MacKenzie & Associates",
    "address": "P O Box 21005 RPO Charleswood",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Pearson Appraisals",
    "firm": "Pearson Appraisals",
    "address": "116 Pinehurst Cres.",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Gordon Daman, AACI, P.App, B.A; Karen Daman, AACI, P.App",
    "firm": "Red River Appraisals",
    "address": "Box 1180",
    "city": "Niverville",
    "province": "MB"
  },
  {
    "name": "Bernard Kelly, MVA",
    "firm": "Remax Thompson",
    "address": "55 Selkirk Avenue",
    "city": "Thompson",
    "province": "MB"
  },
  {
    "name": "Rempel/Wagner/Dunn R.E. Appraisers Ltd.",
    "firm": "Rempel/Wagner/Dunn R.E. Appraisers Ltd.",
    "address": "1383 Pembina Hwy , Suite 103",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Sherrett Appraisals Inc.",
    "firm": "Sherrett Appraisals Inc.",
    "address": "PO BOX 61051 RPO GRANT PARK",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Valerie Jonsson, CRA",
    "firm": "The Appraisal Network",
    "address": "P.O. Box 25105",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Tomchuk & Associates",
    "firm": "Tomchuk & Associates",
    "address": "1027 Redwood Avenue",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Tomiuk Grycko Krueger",
    "firm": "Tomiuk Grycko Krueger",
    "address": "327 Wardlaw Avenue",
    "city": "Winnipeg",
    "province": "MB"
  },
  {
    "name": "Eve Levesque",
    "firm": "Absolute Appraisals",
    "address": "1960 Route 108",
    "city": "DSL of Drummond",
    "province": "NB"
  },
  {
    "name": "John Gorman",
    "firm": "AES CONSULTANTS LTD.",
    "address": "P.O. Box 573 - 360 Parkside Drive",
    "city": "Bathurst",
    "province": "NB"
  },
  {
    "name": "Doug Ramier",
    "firm": "Appraisals (Fundy) Ltd.",
    "address": "29 Duke St",
    "city": "Saint John",
    "province": "NB"
  },
  {
    "name": "Chip Lawton",
    "firm": "De Stecher Appraisals Ltd.",
    "address": "501-61 Union St",
    "city": "St John",
    "province": "NB"
  },
  {
    "name": "Deryl Fitzgerald",
    "firm": "Deryl A. Fitzgerald CRA",
    "address": "1540 Westfield Road",
    "city": "Saint John",
    "province": "NB"
  },
  {
    "name": "Denis Guay",
    "firm": "DG Evaluation",
    "address": "400 Chemin Des Trois Milles",
    "city": "Edmunston",
    "province": "NB"
  },
  {
    "name": "Luc Michaud, AACI",
    "firm": "Evaluation 2000",
    "address": "421 Victoria Street",
    "city": "Edmunston",
    "province": "NB"
  },
  {
    "name": "Rino Durepos, CRA",
    "firm": "Evaluation Action Appraisals",
    "address": "24 Madawaska Rd",
    "city": "Grand Falls",
    "province": "NB"
  },
  {
    "name": "Stephanie Anglehart-Paulin",
    "firm": "Evaluations Anglehart Appraisals",
    "address": "12c Rue Subway St",
    "city": "Campbellton",
    "province": "NB"
  },
  {
    "name": "Conrad Babineau",
    "firm": "Evaluations Babineau Appraisals Ltd.",
    "address": "345 St George St, P.O. Box 1273",
    "city": "Moncton",
    "province": "NB"
  },
  {
    "name": "Jean-Paul Perron",
    "firm": "Evaluations Perrons' Appraisals",
    "address": "19 Stanley St",
    "city": "Campbellton",
    "province": "NB"
  },
  {
    "name": "Rob Doyle, AACI, P.App",
    "firm": "Fredericton Appraisal Associates Ltd.",
    "address": "500 Brookside Dr, Unit E",
    "city": "Fredericton",
    "province": "NB"
  },
  {
    "name": "Greg Barry",
    "firm": "G.A. Barry Appraisals Ltd.",
    "address": "52 Howard Street",
    "city": "Miramichi",
    "province": "NB"
  },
  {
    "name": "Susan Landing",
    "firm": "Landing Appraisals Ltd.",
    "address": "PO Box 1033",
    "city": "St.George",
    "province": "NB"
  },
  {
    "name": "Andrew Leech, CRA",
    "firm": "Leech Appraisals Ltd.",
    "address": "530 Main Street",
    "city": "Woodstock",
    "province": "NB"
  },
  {
    "name": "Terri McGraw",
    "firm": "Mari-Tech Appraisal & Inspection",
    "address": "277 John Street",
    "city": "Moncton",
    "province": "NB"
  },
  {
    "name": "Guy Chiasson",
    "firm": "Northeast Appraisals Ltd.",
    "address": "1607 Sunset Dr",
    "city": "Bathurst",
    "province": "NB"
  },
  {
    "name": "Jean-Paul Perron, CAR, DAC, DAR",
    "firm": "Perron-Lynch & Associates",
    "address": "14 Central St",
    "city": "Campbellton",
    "province": "NB"
  },
  {
    "name": "Normand Thebeau, CRA",
    "firm": "Resurgo Appraisals Inc",
    "address": "1360 Champlain\u00a0 Street",
    "city": "Dieppe",
    "province": "NB"
  },
  {
    "name": "Roxanne Wood",
    "firm": "Roxwood Appraisals",
    "address": "119 Cedar Ave",
    "city": "Fredericton",
    "province": "NB"
  },
  {
    "name": "Mike Barry, CRA",
    "firm": "AAT Appraisers",
    "address": "3 Ivany's Road",
    "city": "Grand Fall-Windsor",
    "province": "NL"
  },
  {
    "name": "Gordon Brewer",
    "firm": "Appraisal Affiliates Inc",
    "address": "40 Main St",
    "city": "Corner Brook",
    "province": "NL"
  },
  {
    "name": "David Sheppard",
    "firm": "Appraisal Associates (Gander) Ltd.",
    "address": "93 Edinburgh Ave",
    "city": "Gander",
    "province": "NL"
  },
  {
    "name": "Wade Cumby, CRA",
    "firm": "Appraisal Associates Limited",
    "address": "157 Pennywell Road",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "name": "Joseph Johnson",
    "firm": "Appraisal of Real Property ltd",
    "address": "55 Quidi Vidi Rd",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "name": "Anthony Woolridge",
    "firm": "Appraisal Service Ltd.",
    "address": "25 Kenmount Road",
    "city": "St John's",
    "province": "NL"
  },
  {
    "name": "Derek Edwards",
    "firm": "Avalon Appraisals Ltd.",
    "address": "Water St., PO Box 531",
    "city": "Hr. Grace",
    "province": "NL"
  },
  {
    "name": "Gerald Greenland",
    "firm": "Bay Roberts Appraisal Services",
    "address": "Box 7",
    "city": "Coley's Point",
    "province": "NL"
  },
  {
    "name": "Ronald Brocklehurst",
    "firm": "Brocklehurst & Company Limited",
    "address": "42 Paddy Dobbin Drive",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "name": "Wayne Burton, CRA",
    "firm": "Burton Appraisal",
    "address": "65 Park St, PO Box 801",
    "city": "Corner Brook",
    "province": "NL"
  },
  {
    "name": "David Wells",
    "firm": "Central Appraisal Services",
    "address": "85 Carter Avenue",
    "city": "Corner Brook",
    "province": "NL"
  },
  {
    "name": "Linda/Warren Toope/Lambat",
    "firm": "Concept Appraisals",
    "address": "323 Memorial Drive",
    "city": "Clarenvillle",
    "province": "NL"
  },
  {
    "name": "Leonard C. Winsor",
    "firm": "DEW Enterprises Ltd.",
    "address": "9 Cartwright Plaza",
    "city": "Grand Falls-Windsor",
    "province": "NL"
  },
  {
    "name": "Christopher Chin",
    "firm": "Elite Appraisals & Consulting",
    "address": "132 Clarence Street",
    "city": "Corner Brook",
    "province": "NL"
  },
  {
    "name": "Maurice Chabot",
    "firm": "Hamilton Contracting Ltd",
    "address": "PO Box 68, Stn C",
    "city": "Goose Bay",
    "province": "NL"
  },
  {
    "name": "Terry Follet",
    "firm": "J & T Appraisals Ltd.",
    "address": "33 Pippy Place",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "name": "Ken Kelly, CRA",
    "firm": "Kelly Appraisal Services",
    "address": "85 Harmsworth Drive",
    "city": "Grand Falls-Windsor",
    "province": "NL"
  },
  {
    "name": "Garrett Kirkland",
    "firm": "kirkland Appraisals",
    "address": "34 Harrington Drive",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "name": "Bill Balsom",
    "firm": "Kirkland, Balsom & Associates",
    "address": "21 Mews Place",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "name": "Travis Hoffe",
    "firm": "MacDonald & Hoffe Appraisals Ltd",
    "address": "17 Mayor Ave",
    "city": "Deer Lake",
    "province": "NL"
  },
  {
    "name": "Roy Prosser",
    "firm": "Prosser Appraisals",
    "address": "10 Sandy Street",
    "city": "Clarenvillle",
    "province": "NL"
  },
  {
    "name": "Stephen Pumphrey",
    "firm": "Pumphrey and Associates Incorporated",
    "address": "11 Perlin Street St.",
    "city": "St. John's",
    "province": "NL"
  },
  {
    "name": "Rex Seaward",
    "firm": "RexNor Enterprise Ltd",
    "address": "13 Dennis Road PO Box 2223",
    "city": "Port aux Basques",
    "province": "NL"
  },
  {
    "name": "Jeffrey Day",
    "firm": "RPS Appraisal Consultants Inc",
    "address": "PO Box 727",
    "city": "Springdale / Goose Bay",
    "province": "NL"
  },
  {
    "name": "Robert White, CRA",
    "firm": "SRW Appraisals",
    "address": "43 Main St. Box 88",
    "city": "Stephenville",
    "province": "NL"
  },
  {
    "name": "Jason Oake, CRA",
    "firm": "Young's Real Estate Appraisal",
    "address": "36 Humberview Dr",
    "city": "Deer Lake",
    "province": "NL"
  },
  {
    "name": "David Dawood",
    "firm": "Abacus Residential Appraisls Inc.",
    "address": "3570 Robie Street unit #4",
    "city": "Halifax",
    "province": "NS"
  },
  {
    "name": "Kelly and Shawna Best",
    "firm": "AKME Appraisals",
    "address": "767 Parkland Drive, Unit 310",
    "city": "Halifax",
    "province": "NS"
  },
  {
    "name": "Chris Flick, AACI",
    "firm": "Alderney R.E. Appraisals",
    "address": "165 Portland Street",
    "city": "Dartmouth",
    "province": "NS"
  },
  {
    "name": "Doreen Allison",
    "firm": "Allison Appraisals Limited",
    "address": "50 Lacy Anne Avenue",
    "city": "Enfield",
    "province": "NS"
  },
  {
    "name": "Jane Antovic",
    "firm": "Antovic Real Property Appraisals",
    "address": "5G Arklow Drive",
    "city": "Dartmouth",
    "province": "NS"
  },
  {
    "name": "Brian Barkhouse, CRA",
    "firm": "Barkhouse Appraisals",
    "address": "27 Spruce Lane",
    "city": "Antigonish",
    "province": "NS"
  },
  {
    "name": "Joseph Boutilier / Jeffrey Pike",
    "firm": "Boutilier & Associates",
    "address": "Box 28070",
    "city": "Dartmouth",
    "province": "NS"
  },
  {
    "name": "Carmel O'Quinn-Conrod",
    "firm": "Carmquin Property Appraisals",
    "address": "8759 Commercial St",
    "city": "New Minas",
    "province": "NS"
  },
  {
    "name": "Donald Taylor, CRA",
    "firm": "Cobequid Appraisal",
    "address": "381 Pleasant Street",
    "city": "Truro",
    "province": "NS"
  },
  {
    "name": "Catherine How, CRA",
    "firm": "Cornerstone Home Appraisals",
    "address": "P.O. Box 500",
    "city": "Annapolis Royal",
    "province": "NS"
  },
  {
    "name": "Paul Fennell, AACI,P.App",
    "firm": "Fennell Associates & Appraisers Inc.",
    "address": "3600 Kempt Road Ste 209",
    "city": "Halifax",
    "province": "NS"
  },
  {
    "name": "Gregory Ratchford, AACI,P.App",
    "firm": "G. Ratchford & Associates Inc",
    "address": "P O Box 5",
    "city": "North Sydney",
    "province": "NS"
  },
  {
    "name": "Regan McAdam, CRA",
    "firm": "Highland Appraisals",
    "address": "4588 West Lake Ainslie",
    "city": "Cape Breton",
    "province": "NS"
  },
  {
    "name": "Jean Hicks, CRA",
    "firm": "Jean Hicks Appraisals",
    "address": "2560 Oxford Street",
    "city": "Halifax",
    "province": "NS"
  },
  {
    "name": "Jonathan MacIvor, CRA",
    "firm": "JF MacIvor Properties",
    "address": "P.O. Box 686",
    "city": "New Glasgow",
    "province": "NS"
  },
  {
    "name": "Robert Joudrey, AACI,P.App",
    "firm": "Joudrey Appraisals",
    "address": "RR 2, New Germany",
    "city": "Lunenburg County",
    "province": "NS"
  },
  {
    "name": "Philson Kempton, AACI,P.App,Fellow / Paul Young, AACI,P.App",
    "firm": "Kempton Appraisals Ltd.",
    "address": "376 Portland St",
    "city": "Dartmouth",
    "province": "NS"
  },
  {
    "name": "Bruce Kennedy, CRA",
    "firm": "Kennedy Appraisals (NS)",
    "address": "48 O'Neil Lane",
    "city": "Glace Bay",
    "province": "NS"
  },
  {
    "name": "Larry Matthews DAC",
    "firm": "Larry Matthews Appraisals",
    "address": "P.O. Box 132",
    "city": "Shubenacadie",
    "province": "NS"
  },
  {
    "name": "William Martheleur, CRA",
    "firm": "Mackey Appraisal Ltd.",
    "address": "50 Amberwood Cres",
    "city": "Sydney",
    "province": "NS"
  },
  {
    "name": "Malcolm Tizzard, CRA",
    "firm": "Malcolm S. Tizzard",
    "address": "1036 Kolbec Road",
    "city": "Oxford",
    "province": "NS"
  },
  {
    "name": "Rex Seaward, AACI,P.App",
    "firm": "Mari-Tech Appraisal & Inspection",
    "address": "5 Waddell Avenue",
    "city": "Dartmouth",
    "province": "NS"
  },
  {
    "name": "Brian AuCoin, CRA",
    "firm": "McCharles Appraisals",
    "address": "8 Sandpiper Court",
    "city": "Sydney River",
    "province": "NS"
  },
  {
    "name": "Natalie Bell, CRA",
    "firm": "NJ Bell Appraisals",
    "address": "PO Box 382, 1962 Purvis Ave",
    "city": "Westville",
    "province": "NS"
  },
  {
    "name": "Paul Wade, AACI,P.App",
    "firm": "Nova West Valuations",
    "address": "Box 8",
    "city": "Churchpoint",
    "province": "NS"
  },
  {
    "name": "Joy Herbert, CRA",
    "firm": "R & J Appraisals",
    "address": "Box 623",
    "city": "Kingston",
    "province": "NS"
  },
  {
    "name": "Bryson Crowell, CRA",
    "firm": "Remax Banner",
    "address": "284 Main St",
    "city": "Middleton",
    "province": "NS"
  },
  {
    "name": "Robert Wambolt DAR",
    "firm": "Robert Wambolt Appraisals",
    "address": "10089 Grenville Street, PO Box 226",
    "city": "St. Peter's",
    "province": "NS"
  },
  {
    "name": "Mary Ellen Hernden, CRA",
    "firm": "Sterling Property Appraisals & Consulting Ltd.",
    "address": "39 Sandycove Loop",
    "city": "Chester Basin",
    "province": "NS"
  },
  {
    "name": "Linda MacKay, CRA",
    "firm": "The MacKay Group Ltd.",
    "address": "179 Munroe Ave Exten",
    "city": "Westville Road",
    "province": "NS"
  },
  {
    "name": "William Black, CRA / Sean Black, CRA",
    "firm": "W. Black & Sons R.E. Ltd.",
    "address": "222 Commerical St",
    "city": "North Sydney",
    "province": "NS"
  },
  {
    "name": "Alexander Watt, CRA",
    "firm": "Watt Realty Appraisals",
    "address": "RR6 55 Peppard Dr.",
    "city": "Truro",
    "province": "NS"
  },
  {
    "name": "David Wetmore, CRA / Carol Wetmore, CRA",
    "firm": "Wetmore-Corkum Appraisals",
    "address": "32 Cornwallis Street",
    "city": "Kentville",
    "province": "NS"
  },
  {
    "name": "Kenneth Young, AACI, P.App.",
    "firm": "Young & Associates",
    "address": "450 Lahave Street , Unit 17",
    "city": "Bridgewater",
    "province": "NS"
  },
  {
    "name": "David Xu, CRA",
    "firm": "24 Appraisal Inc.",
    "address": "101 Placer Court Suite A2",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "name": "Chuck Auger",
    "firm": "A&M Property Appraisals Ltd.",
    "address": "22 Wilcox Street",
    "city": "Timmins",
    "province": "ON"
  },
  {
    "name": "Michael Lau",
    "firm": "A.L.L Appraisal Services Ltd.",
    "address": "21 Thames Avenue",
    "city": "Etobicoke",
    "province": "ON"
  },
  {
    "name": "Fred Klonowski, CRA",
    "firm": "Aaron Appraisals",
    "address": "19 Kew Gardens",
    "city": "Richmond Hill",
    "province": "ON"
  },
  {
    "name": "Leslie Lee, CRA",
    "firm": "AB Appraisal Services Inc. (Port Dover)",
    "address": "572 New Lakeshore Rd.",
    "city": "Port Dover",
    "province": "ON"
  },
  {
    "name": "Arlene Blake-Brown, CRA",
    "firm": "AB Appraisal Services Inc. (Stoney Creek)",
    "address": "24-484 Millen Road",
    "city": "Stoney Creek",
    "province": "ON"
  },
  {
    "name": "Accredited Appraisal Services",
    "firm": "Accredited Appraisal Services",
    "address": "3114 Burnhamthorpe Road West",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "name": "Accurate (Peel) Appraisals Inc.",
    "firm": "Accurate (Peel) Appraisals Inc.",
    "address": "10 McColl Drive",
    "city": "Caledon",
    "province": "ON"
  },
  {
    "name": "ACI Appraisal Company Inc",
    "firm": "ACI Appraisal Company Inc",
    "address": "56 Brownlow Avenue",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "name": "Adele Kelly, CRA",
    "firm": "Adele Kelly Appraisers",
    "address": "380 Moffat St",
    "city": "Pembroke",
    "province": "ON"
  },
  {
    "name": "Korosh Shahbazi, AACI",
    "firm": "Advance Appraisals Inc.",
    "address": "8171 Younge Street, Suite 250",
    "city": "Markham",
    "province": "ON"
  },
  {
    "name": "Terry Jaja",
    "firm": "Affiliated Property Group (Ontario)",
    "address": "384 Richmond Road",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "name": "Alexander McMillan R.E. Appraisal Services",
    "firm": "Alexander McMillan R.E. Appraisal Services",
    "address": "6562 6th Concession Rd",
    "city": "Addison",
    "province": "ON"
  },
  {
    "name": "Appraisal 2000 Realty Group",
    "firm": "Appraisal 2000 Realty Group",
    "address": "690 Rowntree Dairy Road, #200",
    "city": "Vaughan",
    "province": "ON"
  },
  {
    "name": "Giuseppe (Joe) Montagnese, DAR",
    "firm": "Appraisal Advantage Canada Incorporated",
    "address": "4936 Yonge St Suite 242",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "name": "Appraisal Connection",
    "firm": "Appraisal Connection",
    "address": "104 Venice Cres.",
    "city": "Thornhill",
    "province": "ON"
  },
  {
    "name": "Michael Vecchio, AACI,P.App",
    "firm": "Appraisal Group (Thunder Bay)",
    "address": "291 Court St South",
    "city": "Thunder Bay",
    "province": "ON"
  },
  {
    "name": "Gary Pike, CRA",
    "firm": "Appraisal One",
    "address": "3072 Leo Avenue",
    "city": "Greater Sudbury",
    "province": "ON"
  },
  {
    "name": "Robert Cushing, MBA, AACI, P.App  /  Henry Godfrey DAR",
    "firm": "Appraisals by C & G Inc",
    "address": "245 Wembley Drive",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "name": "Donald Proctor, CRA",
    "firm": "Appraisals Completed Ltd.",
    "address": "871 Woollen Mill Rd, Conc. 6  Woodhouse",
    "city": "Simcoe",
    "province": "ON"
  },
  {
    "name": "Doug Ellwood, CRA",
    "firm": "Appraisals Niagara",
    "address": "5773 Depew Avenue",
    "city": "Niagara Falls",
    "province": "ON"
  },
  {
    "name": "Appraisals North Realty Inc.",
    "firm": "Appraisals North Realty Inc.",
    "address": "66 Elm Street, Suite 301",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "name": "Associated Realty Consultants 2000 Inc.",
    "firm": "Associated Realty Consultants 2000 Inc.",
    "address": "Box 21176",
    "city": "Stratford",
    "province": "ON"
  },
  {
    "name": "Peyman Etemadi, CRA",
    "firm": "Assurance Appraisal Inc.",
    "address": "2805 - 13035 Yonge St",
    "city": "Richmond Hill",
    "province": "ON"
  },
  {
    "name": "Austin & Austin Realty",
    "firm": "Austin & Austin Realty",
    "address": "Box 790  3-35 Whyte Ave",
    "city": "Dryden",
    "province": "ON"
  },
  {
    "name": "B C Appraisals Inc.",
    "firm": "B C Appraisals Inc.",
    "address": "763 Norfolk St S Unit #1",
    "city": "Simcoe",
    "province": "ON"
  },
  {
    "name": "Arend Baayen, CRA",
    "firm": "Baayen & Associates",
    "address": "273 Parkview Hills Dr.",
    "city": "Cobourg",
    "province": "ON"
  },
  {
    "name": "Karel Baayen, AACI, P.App",
    "firm": "Baayen & Associates Appraisers",
    "address": "347 Pido Road, Unit 7",
    "city": "Peterborough",
    "province": "ON"
  },
  {
    "name": "Barker Real Estate Appraisals",
    "firm": "Barker Real Estate Appraisals",
    "address": "4 McLaughlin Road S",
    "city": "Brampton",
    "province": "ON"
  },
  {
    "name": "Barrons Real Estate Appraisals",
    "firm": "Barrons Real Estate Appraisals",
    "address": "1319 Exmouth St., Sarnia",
    "city": "Sarnia",
    "province": "ON"
  },
  {
    "name": "Barry Page, CRA",
    "firm": "Barry Page",
    "address": "91 Neywash St",
    "city": "Orillia",
    "province": "ON"
  },
  {
    "name": "Roger Kolbuc, DAR",
    "firm": "Bayline Real Estate Ltd.",
    "address": "1007 McDonald Road",
    "city": "Foot's Bay",
    "province": "ON"
  },
  {
    "name": "Bayside Appraisals",
    "firm": "Bayside Appraisals",
    "address": "22 Alfred Street East",
    "city": "Thornbury",
    "province": "ON"
  },
  {
    "name": "Elio Bellai, CRA",
    "firm": "Bellai & Associates Appraisal Services",
    "address": "39 Walman Dr.",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "name": "Berk Appraisal Services",
    "firm": "Berk Appraisal Services",
    "address": "71A Leland St.",
    "city": "Hamilton",
    "province": "ON"
  },
  {
    "name": "Blake Bobechko, AACI, P.App",
    "firm": "Blake Matlock & Marshal",
    "address": "75 First St., Suite 106",
    "city": "Orangeville",
    "province": "ON"
  },
  {
    "name": "Bob Jugovic Real Estate Ltd",
    "firm": "Bob Jugovic Real Estate Ltd",
    "address": "47 Ottawa Street",
    "city": "North Hamilton",
    "province": "ON"
  },
  {
    "name": "Paul Duarte, CRA",
    "firm": "Bona Fide Appraisals Inc",
    "address": "348-610 Ford Drive",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "name": "Cheryl Whitworth, CRA",
    "firm": "Brant Residential Appraisals",
    "address": "22 Grace Ave",
    "city": "Brantford",
    "province": "ON"
  },
  {
    "name": "David Brighton, CRA",
    "firm": "Brighton Appraisals",
    "address": "234 9th St",
    "city": "Hanover",
    "province": "ON"
  },
  {
    "name": "Brox Appraisals Inc",
    "firm": "Brox Appraisals Inc",
    "address": "126 Weber Street North",
    "city": "Waterloo",
    "province": "ON"
  },
  {
    "name": "C. M. Bradshaw & Associates",
    "firm": "C. M. Bradshaw & Associates",
    "address": "P O Box 221",
    "city": "Foxboro",
    "province": "ON"
  },
  {
    "name": "Canadian Home Appraisals Inc.",
    "firm": "Canadian Home Appraisals Inc.",
    "address": "14 Clementine Square",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "name": "James Carty, DAR  /  Johnathan Carty, DAR",
    "firm": "Carty Appraisals",
    "address": "484 Main St",
    "city": "Winchester",
    "province": "ON"
  },
  {
    "name": "Leonard Carty, AACI,P.App",
    "firm": "Carty Gwilym Real Estate Appraisals",
    "address": "1770 Courtwood Crescent, Suite 202",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "name": "Chantal Lavigne",
    "firm": "Chantal Lavigne",
    "address": "192 Patrick Ave",
    "city": "Renfrew",
    "province": "ON"
  },
  {
    "name": "Thomas Cull, CRA",
    "firm": "Charles Bell Real Estate Appraisals Ltd.",
    "address": "130 Paris Street",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "name": "Christopher Dopko, CRA",
    "firm": "Chris Dopko Appraisal Services",
    "address": "Box 4, 8 - 136 Peachtree Ln",
    "city": "Grimsby",
    "province": "ON"
  },
  {
    "name": "Mark Clay, AACI P.App",
    "firm": "Clay Property Appraisls",
    "address": "307 River Rd",
    "city": "Sault Ste. Marie",
    "province": "ON"
  },
  {
    "name": "Consolidated Appraisal Service Ltd",
    "firm": "Consolidated Appraisal Service Ltd",
    "address": "274 Burton Avenue, Unit 22",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "name": "Ida Miceli-Constant",
    "firm": "Constant Appraisals Ltd",
    "address": "6193 Duford Dr",
    "city": "Mississauga",
    "province": "ON"
  },
  {
    "name": "Joyce Schlaht, CRA",
    "firm": "Cornerstone Appraisal Services",
    "address": "12 Aspenwood Place",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "name": "Coulson Appraisals Ltd.",
    "firm": "Coulson Appraisals Ltd.",
    "address": "53-5100 South Service Rd.",
    "city": "Burlington",
    "province": "ON"
  },
  {
    "name": "Rajesh Mohan, CRA",
    "firm": "Creditview Appraisals Inc",
    "address": "14 Jevins Close",
    "city": "Brampton",
    "province": "ON"
  },
  {
    "name": "Joseph Danford, CRA and John Danford, CRA",
    "firm": "Danford Appraisals",
    "address": "80 Bradford Street, Suite 316",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "name": "Dennis J Murphy Real Estate Appraisers",
    "firm": "Dennis J Murphy Real Estate Appraisers",
    "address": "18 Bridle Trail",
    "city": "Midhurst",
    "province": "ON"
  },
  {
    "name": "Gaston Denomme, CRA",
    "firm": "Denomme Appraisals",
    "address": "328 First St",
    "city": "Collingwood",
    "province": "ON"
  },
  {
    "name": "Dhaval Patel, CRA",
    "firm": "DK Appraisals",
    "address": "49 Lesabre Crescent",
    "city": "Brampton",
    "province": "ON"
  },
  {
    "name": "DRW Appraisal Inc.",
    "firm": "DRW Appraisal Inc.",
    "address": "2 Price St, P.O Box #204",
    "city": "Brooklin",
    "province": "ON"
  },
  {
    "name": "Edward Hick, CRA",
    "firm": "EM Hick Appraisals",
    "address": "67 Bridge Street East",
    "city": "Campbellford",
    "province": "ON"
  },
  {
    "name": "Enns MacEachern Pace Maloney",
    "firm": "Enns MacEachern Pace Maloney",
    "address": "850 Boundary Road, Unit #10",
    "city": "Cornwall",
    "province": "ON"
  },
  {
    "name": "Ernie McElrea, CRA",
    "firm": "Ernie McElrea, CRA",
    "address": "144 Adelaide St North",
    "city": "Lindsay",
    "province": "ON"
  },
  {
    "name": "ES Gorski Realty Ltd",
    "firm": "ES Gorski Realty Ltd",
    "address": "300 Cabana Rd E Lower Level",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "name": "Marc Dallaire, CRA",
    "firm": "Essential Appraisal Services Ltd.",
    "address": "2727 Courtice Road PO Box 98011",
    "city": "Courtice",
    "province": "ON"
  },
  {
    "name": "Everest Appraisal Services",
    "firm": "Everest Appraisal Services",
    "address": "47 Albery Crescent",
    "city": "Ajax",
    "province": "ON"
  },
  {
    "name": "Everts Realty Appraisals and Co",
    "firm": "Everts Realty Appraisals and Co",
    "address": "374 Wilmont Avenue",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "name": "Sarah Mitchell, CRA",
    "firm": "F.K. Mitchell Appraisals Inc.",
    "address": "300 Eugent Street East Unit B",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "name": "F.R.Jordan & Associates",
    "firm": "F.R.Jordan & Associates",
    "address": "120 - 3005 Marentette Avenue",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "name": "Fletcher Professional Realty Appraisal",
    "firm": "Fletcher Professional Realty Appraisal",
    "address": "1174 Woodington Lane",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "name": "G.W. Martin Appraisal Ltd.",
    "firm": "G.W. Martin Appraisal Ltd.",
    "address": "1c Conestoga Drive Suite 200",
    "city": "Brampton",
    "province": "ON"
  },
  {
    "name": "Kathy Murphy, CRA",
    "firm": "Gagner & Associates Excel Realty Services",
    "address": "141 St Clair Street",
    "city": "Chatham",
    "province": "ON"
  },
  {
    "name": "Ruban Kanagenthiran, DAR",
    "firm": "Genesis Appraisals",
    "address": "151 Nashdene Rd U47",
    "city": "Scarborough",
    "province": "ON"
  },
  {
    "name": "Georgian Property Appraisals",
    "firm": "Georgian Property Appraisals",
    "address": "3-1565 16th Street East, Suite 130",
    "city": "Owen Sound",
    "province": "ON"
  },
  {
    "name": "Gifford Appraisals",
    "firm": "Gifford Appraisals",
    "address": "P.O. Box 603",
    "city": "Pickering",
    "province": "ON"
  },
  {
    "name": "Grand River Real Estate Appraisals",
    "firm": "Grand River Real Estate Appraisals",
    "address": "12 Starview Crescent",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "name": "Haliburton Appraisal Services",
    "firm": "Haliburton Appraisal Services",
    "address": "Box 1175",
    "city": "Haliburton",
    "province": "ON"
  },
  {
    "name": "David Brighton, CRA",
    "firm": "Hanover Realty Appraisal (AKA Brighton Appraisals)",
    "address": "303 - 6th St",
    "city": "Hanover",
    "province": "ON"
  },
  {
    "name": "Harbourview Property Services",
    "firm": "Harbourview Property Services",
    "address": "120 Melville St",
    "city": "Dundas",
    "province": "ON"
  },
  {
    "name": "William Parks, AACI",
    "firm": "Harry and Company",
    "address": "141 St Clair Street",
    "city": "Chatham",
    "province": "ON"
  },
  {
    "name": "Harvey Dawe Realty Ltd.",
    "firm": "Harvey Dawe Realty Ltd.",
    "address": "77 Russell St W",
    "city": "Lindsay",
    "province": "ON"
  },
  {
    "name": "Hastings Appraisal Services",
    "firm": "Hastings Appraisal Services",
    "address": "Unit 1B., 290 Dundas St., W.",
    "city": "Trenton",
    "province": "ON"
  },
  {
    "name": "Hendren Appraisals",
    "firm": "Hendren Appraisals",
    "address": "44 Queen Street E",
    "city": "Brampton",
    "province": "ON"
  },
  {
    "name": "Michael Gillis, CRA",
    "firm": "HG Appraisers Inc.",
    "address": "297 Ste. Marie St.",
    "city": "Collingwood",
    "province": "ON"
  },
  {
    "name": "Robert Holmes, CRA",
    "firm": "Holmes Appraisals",
    "address": "769 Allum Ave",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "name": "Homefacts R E Services",
    "firm": "Homefacts R E Services",
    "address": "71 Fairwood Pl W",
    "city": "Burlington",
    "province": "ON"
  },
  {
    "name": "Hurg R. Fay & Associates",
    "firm": "Hurg R. Fay & Associates",
    "address": "1405 Pope Street",
    "city": "LaSalle",
    "province": "ON"
  },
  {
    "name": "Hutchesson Appraisals (formerly Hutchesson, Gignac Ltd.)",
    "firm": "Hutchesson Appraisals (formerly Hutchesson, Gignac Ltd.)",
    "address": "8 Seely Court",
    "city": "Wasaga Beach",
    "province": "ON"
  },
  {
    "name": "Gary Hutton",
    "firm": "Hutton Appraisal Service",
    "address": "RR2",
    "city": "Bracebridge",
    "province": "ON"
  },
  {
    "name": "Mike Domjancic, BBA, AACI, P.App.",
    "firm": "iAppraise Inc.",
    "address": "3191 Saltaire Cres.",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "name": "Independent Appraisal Corp.",
    "firm": "Independent Appraisal Corp.",
    "address": "21 - 5330 canotek Road",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "name": "John Swan, CRA",
    "firm": "J. Swan Appraisals",
    "address": "Box 220 - 46 Walker Road",
    "city": "Perkinsfield",
    "province": "ON"
  },
  {
    "name": "Jack Graves Realty Ltd",
    "firm": "Jack Graves Realty Ltd",
    "address": "439 Broadway",
    "city": "Tillsonburg",
    "province": "ON"
  },
  {
    "name": "Jeffrey Derochie, CRA",
    "firm": "Jeff Derochie Appraisal Service",
    "address": "3621 Maisonneuve Ave",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "name": "Jill Murphy, CRA",
    "firm": "Jill Murphy & Associates Inc.",
    "address": "185 Robinson St",
    "city": "Oakville",
    "province": "ON"
  },
  {
    "name": "Johannsen Appraisal Services",
    "firm": "Johannsen Appraisal Services",
    "address": "239 Pine Street",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "name": "John A. Shamess Appraisals",
    "firm": "John A. Shamess Appraisals",
    "address": "P.O. Box 452",
    "city": "Elliot Lake",
    "province": "ON"
  },
  {
    "name": "John Gebal, CRA",
    "firm": "John F. Gebal Real Estate Services",
    "address": "12 School Street",
    "city": "Chatham",
    "province": "ON"
  },
  {
    "name": "Johnson Pietz Consulting Group",
    "firm": "Johnson Pietz Consulting Group",
    "address": "Box 632",
    "city": "Fonthill",
    "province": "ON"
  },
  {
    "name": "Katrina Baker, CRA",
    "firm": "K Baker Property Appraisals",
    "address": "226 Country Club Drive",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "name": "K. Downe Residential Appraisals",
    "firm": "K. Downe Residential Appraisals",
    "address": "43 Bishop Court",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "name": "K. Murphy Real Estate Appraisal Services",
    "firm": "K. Murphy Real Estate Appraisal Services",
    "address": "102 Gladstone Ave",
    "city": "Chatham",
    "province": "ON"
  },
  {
    "name": "Charlotte Bouckley, AACI,P.App",
    "firm": "K.J. Stub & Associates",
    "address": "89 Wharncliffe Rd N, Unit 5",
    "city": "London",
    "province": "ON"
  },
  {
    "name": "Kahle Appraisers and Consultants",
    "firm": "Kahle Appraisers and Consultants",
    "address": "335 Redford Cr.",
    "city": "Stratford",
    "province": "ON"
  },
  {
    "name": "Keller Williams Ottawa Realty",
    "firm": "Keller Williams Ottawa Realty",
    "address": "610 Bronson Ave",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "name": "Kennedy Appraisals Inc.",
    "firm": "Kennedy Appraisals Inc.",
    "address": "14519 Elginfield Road",
    "city": "Lucan",
    "province": "ON"
  },
  {
    "name": "Mike Kervin",
    "firm": "Kervin Associates Inc.",
    "address": "797 McIntyre St West",
    "city": "North Bay",
    "province": "ON"
  },
  {
    "name": "Jessica McComb, CRA",
    "firm": "KF McComb Appraisal Services",
    "address": "898 Queen St East",
    "city": "Sault Ste Marie",
    "province": "ON"
  },
  {
    "name": "Wayne Kitchen, AACI,P.App",
    "firm": "Kitchen & Company Appraisal Services",
    "address": "155 Manitoba Street",
    "city": "Bracebridge",
    "province": "ON"
  },
  {
    "name": "Kimberly Stewart, DAR/CAR",
    "firm": "KS Appraisal Services",
    "address": "22 Oriole Cres,",
    "city": "Baltimore",
    "province": "ON"
  },
  {
    "name": "L.A. Mirotta & Company",
    "firm": "L.A. Mirotta & Company",
    "address": "70 Hazelwood Drive",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "name": "Lack Realty Appr & Cons Inc.",
    "firm": "Lack Realty Appr & Cons Inc.",
    "address": "110- 1050 Simcoe St., North",
    "city": "Oshawa",
    "province": "ON"
  },
  {
    "name": "Ronald House, DAR",
    "firm": "Lakeland Appraisals",
    "address": "260 Summit Drive",
    "city": "Huntsville",
    "province": "ON"
  },
  {
    "name": "Landry's for Real Estate",
    "firm": "Landry's for Real Estate",
    "address": "231 First St. S",
    "city": "Kenora",
    "province": "ON"
  },
  {
    "name": "Laser Appraiser",
    "firm": "Laser Appraiser",
    "address": "938 Brock Rd",
    "city": "Dundas",
    "province": "ON"
  },
  {
    "name": "Latitude 50 Realty",
    "firm": "Latitude 50 Realty",
    "address": "Box 758, 100 Claybanks Road",
    "city": "Dryden",
    "province": "ON"
  },
  {
    "name": "Lea Robertson, CRA",
    "firm": "Lea Robertson, CRA",
    "address": "70 King William St",
    "city": "Huntsville",
    "province": "ON"
  },
  {
    "name": "Leander Property Appraisals Inc.",
    "firm": "Leander Property Appraisals Inc.",
    "address": "155 East Beaver Creek Rd #24, Suite 315",
    "city": "Richmond Hill",
    "province": "ON"
  },
  {
    "name": "LeBreton Appraisal Services",
    "firm": "LeBreton Appraisal Services",
    "address": "87 Woodroffe Ave",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "name": "Lenc Appraisals",
    "firm": "Lenc Appraisals",
    "address": "Box 957",
    "city": "Barry's Bay",
    "province": "ON"
  },
  {
    "name": "Leslie Weatherby, AACI",
    "firm": "Leslie T. Weatherby Realty",
    "address": "272 Wellington Street",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "name": "LOCC R. E Appraisal Inc.",
    "firm": "LOCC R. E Appraisal Inc.",
    "address": "559 Exmouth Street",
    "city": "Sarnia",
    "province": "ON"
  },
  {
    "name": "M K Espie Appraisals & Consulting",
    "firm": "M K Espie Appraisals & Consulting",
    "address": "463 Victoria Street",
    "city": "Port Perry",
    "province": "ON"
  },
  {
    "name": "M Machel & Associates Ltd.",
    "firm": "M Machel & Associates Ltd.",
    "address": "332 Charles St. E",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "name": "Jason Lee, AACI",
    "firm": "Maker Real Estate Appraisals Inc",
    "address": "8777 Dufferin Street TH39",
    "city": "Thornhill",
    "province": "ON"
  },
  {
    "name": "McIver Group Inc",
    "firm": "McIver Group Inc",
    "address": "238 Piccadilly Street",
    "city": "London",
    "province": "ON"
  },
  {
    "name": "Michael Frawley, AACI,P.App",
    "firm": "MF Appraisals",
    "address": "4373 Elizabeth Crescent",
    "city": "Val Therese",
    "province": "ON"
  },
  {
    "name": "Michel Rozon, CRA",
    "firm": "Michel Rozon & Associates",
    "address": "836 Royal Ave",
    "city": "Hawkesbury",
    "province": "ON"
  },
  {
    "name": "Mid - North Appraisals Ltd.",
    "firm": "Mid - North Appraisals Ltd.",
    "address": "745 Valley View Drive West",
    "city": "Powassan",
    "province": "ON"
  },
  {
    "name": "Midland Appraisals",
    "firm": "Midland Appraisals",
    "address": "295 King St",
    "city": "Midland",
    "province": "ON"
  },
  {
    "name": "Janice Jordan, CRA",
    "firm": "Mississippi Appraisal Services",
    "address": "114 Mitchell Lane",
    "city": "Carlton Place",
    "province": "ON"
  },
  {
    "name": "Gordon Morland, CRA",
    "firm": "Morland R. E. Appraisals",
    "address": "382 Fraser Street",
    "city": "North Bay",
    "province": "ON"
  },
  {
    "name": "Murray A Farrell & Associates",
    "firm": "Murray A Farrell & Associates",
    "address": "515 Dundas Street",
    "city": "Woodstock",
    "province": "ON"
  },
  {
    "name": "Brad Murray, CRA/Colin Murray, CRA",
    "firm": "Murray Appraisals",
    "address": "74 Redford Crescent",
    "city": "Stratford",
    "province": "ON"
  },
  {
    "name": "MW Cotman & Associates (formerly McGugan & Ass.)",
    "firm": "MW Cotman & Associates (formerly McGugan & Ass.)",
    "address": "PO Box 488",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "name": "Robert North, CRA",
    "firm": "North Broadfoot Gribbon Inc",
    "address": "1035 Red Spruce Street",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "name": "Joel Erichsen-Brown, DAR",
    "firm": "North Muskoka Appraisals",
    "address": "1672 Williamsport Road",
    "city": "Huntsville",
    "province": "ON"
  },
  {
    "name": "Northern Ontario Appraisals",
    "firm": "Northern Ontario Appraisals",
    "address": "476 Rochester Ave",
    "city": "Timmins",
    "province": "ON"
  },
  {
    "name": "William (Bill) McCutcheon, CRA",
    "firm": "Oakridge Appraisal Services Ltd.",
    "address": "PO Box 336",
    "city": "Napanee",
    "province": "ON"
  },
  {
    "name": "Ottawa Carlton Appraisal",
    "firm": "Ottawa Carlton Appraisal",
    "address": "122 Clarkson Cresc.",
    "city": "Kanata",
    "province": "ON"
  },
  {
    "name": "Jason Otto, AACI P.App",
    "firm": "Otto & Company",
    "address": "Unit 34, 1615 North Routledge Park",
    "city": "London",
    "province": "ON"
  },
  {
    "name": "Pasquale Cristina, DAR",
    "firm": "PAC Appraisal Inc",
    "address": "251 Queen St S, Suite 261",
    "city": "Mississauga",
    "province": "ON"
  },
  {
    "name": "Christopher Marchand, CRA",
    "firm": "Patrol Property Services",
    "address": "2884 Kent Line",
    "city": "Wallaceburg",
    "province": "ON"
  },
  {
    "name": "Paul Raymer Appraisals",
    "firm": "Paul Raymer Appraisals",
    "address": "PO Box 427",
    "city": "Markham",
    "province": "ON"
  },
  {
    "name": "Peter Boot Realty and Appraisal Services",
    "firm": "Peter Boot Realty and Appraisal Services",
    "address": "441 Water Street",
    "city": "Peterborough",
    "province": "ON"
  },
  {
    "name": "Peter W Griesbach",
    "firm": "Peter W Griesbach",
    "address": "RR1 Sydenham",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "name": "Ashley Gray, DAR",
    "firm": "Pinpoint Appraisers Inc",
    "address": "1110 Elizabeth St. PO Box 5",
    "city": "Sharbot Lake",
    "province": "ON"
  },
  {
    "name": "Jonathan Wollziefer, CRA",
    "firm": "Precise Real Estate Appraising Inc.",
    "address": "23134 - 500 Fairway Rd. S",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "name": "Premier Appraisal Services Inc",
    "firm": "Premier Appraisal Services Inc",
    "address": "8 McClarnan Road",
    "city": "Ajax",
    "province": "ON"
  },
  {
    "name": "Prince Edward Appraisals",
    "firm": "Prince Edward Appraisals",
    "address": "#42 Main Street",
    "city": "Picton",
    "province": "ON"
  },
  {
    "name": "Valerie Else, CRA",
    "firm": "Professional Appraisal Associates",
    "address": "1856 Marconi Blvd",
    "city": "London",
    "province": "ON"
  },
  {
    "name": "Progressive Appraisal Services Inc",
    "firm": "Progressive Appraisal Services Inc",
    "address": "20531 Purple Hill Road",
    "city": "Thorndale",
    "province": "ON"
  },
  {
    "name": "Murray Visser, AACI,P.App",
    "firm": "Property Valuators Consulting Inc  (PVCI Inc.)",
    "address": "182 Wellington Street West",
    "city": "Bowmanville",
    "province": "ON"
  },
  {
    "name": "R W Dyer Realty Inc",
    "firm": "R W Dyer Realty Inc",
    "address": "29 Blair Rd",
    "city": "Cambridge",
    "province": "ON"
  },
  {
    "name": "R.A. Critchlow  Realty",
    "firm": "R.A. Critchlow  Realty",
    "address": "20 Mill St., W.,",
    "city": "Leamington",
    "province": "ON"
  },
  {
    "name": "Robert Lyons, CRA",
    "firm": "R.J. Lyons Real Estate Appraisal Services",
    "address": "6-575 Wharncliffe Rd S",
    "city": "London",
    "province": "ON"
  },
  {
    "name": "James (Jim) Jacques, CRA",
    "firm": "Real Estate Appraising and Consulting",
    "address": "607 King Street West",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "name": "John A. Corney, DAR",
    "firm": "Regional Appraisals Inc",
    "address": "3521 Portage Road, Unit A",
    "city": "Niagara Falls",
    "province": "ON"
  },
  {
    "name": "Reliable Appraisal Services",
    "firm": "Reliable Appraisal Services",
    "address": "2150 Burnhamthorpe Road West #208",
    "city": "Mississauga",
    "province": "ON"
  },
  {
    "name": "Ridley & Associates",
    "firm": "Ridley & Associates",
    "address": "50 William St",
    "city": "St. Catharines",
    "province": "ON"
  },
  {
    "name": "Colleen Hall-Clark, CRA",
    "firm": "Rivington Appraisers Inc.",
    "address": "655 Pembroke Street West",
    "city": "Pembroke",
    "province": "ON"
  },
  {
    "name": "Mark Schroeder, CRA",
    "firm": "Rivingtons of Pembroke Inc.",
    "address": "655 Pembroke St W",
    "city": "Pembroke",
    "province": "ON"
  },
  {
    "name": "Ron Merkley Real Estate & App.",
    "firm": "Ron Merkley Real Estate & App.",
    "address": "21 Apple Street",
    "city": "Brockville",
    "province": "ON"
  },
  {
    "name": "Ron Poliwoda R.E. Appraiser",
    "firm": "Ron Poliwoda R.E. Appraiser",
    "address": "59 Mountbatten Road",
    "city": "Thornhill",
    "province": "ON"
  },
  {
    "name": "Royal Lepage Team Advantage Realty",
    "firm": "Royal Lepage Team Advantage Realty",
    "address": "49 James Street",
    "city": "Parry Sound",
    "province": "ON"
  },
  {
    "name": "Sam Purdy, AACI, P.App",
    "firm": "S L Purdy & Associates Ltd.",
    "address": "PO Box 209",
    "city": "Coe Hill",
    "province": "ON"
  },
  {
    "name": "S. Rayner & Associates Ltd.",
    "firm": "S. Rayner & Associates Ltd.",
    "address": "590 Cataraqui Woods Dr., Suite 2",
    "city": "Kingston",
    "province": "ON"
  },
  {
    "name": "Kim Passmore, AACI, P.App.",
    "firm": "S.W. Irvine & Asslociates",
    "address": "155 Suffolk Street W, 2nd floor",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "name": "Scanlon & Associates",
    "firm": "Scanlon & Associates",
    "address": "332 Mississauga St W.",
    "city": "Orillia",
    "province": "ON"
  },
  {
    "name": "Robert Schinkel, AACI, P.App",
    "firm": "Schinkel Real Estate & Appraisals Inc.",
    "address": "1059 Upper James Suite 205",
    "city": "Hamilton",
    "province": "ON"
  },
  {
    "name": "Schleifer & Associates (Anthony Schleifer)",
    "firm": "Schleifer & Associates (Anthony Schleifer)",
    "address": "781 Thompson Rd",
    "city": "Waterford",
    "province": "ON"
  },
  {
    "name": "Daniel Shields, AACI",
    "firm": "Shields Appraisals & Consulting Ltd.",
    "address": "875 Queen Street East",
    "city": "Sault Ste Marie",
    "province": "ON"
  },
  {
    "name": "Simon & Associates Ltd.",
    "firm": "Simon & Associates Ltd.",
    "address": "60 Marycroft Avenue, Unit 6",
    "city": "Vaughan",
    "province": "ON"
  },
  {
    "name": "James Maki, CRA",
    "firm": "South Coast Appraisals",
    "address": "157 King Lane",
    "city": "Simcoe",
    "province": "ON"
  },
  {
    "name": "Sovereign Appraisals Ltd.",
    "firm": "Sovereign Appraisals Ltd.",
    "address": "PO Box 353",
    "city": "Windsor",
    "province": "ON"
  },
  {
    "name": "Shirley Padalino, CRA",
    "firm": "Sprint Residential Appraisals",
    "address": "Suite L1 \u2013 625 King Street East",
    "city": "Kitchener",
    "province": "ON"
  },
  {
    "name": "Larry Stanshall, CRA",
    "firm": "Stanshall & Associates",
    "address": "26 Marigold St",
    "city": "Brantford",
    "province": "ON"
  },
  {
    "name": "Steele & Associates",
    "firm": "Steele & Associates",
    "address": "55 Nancy Drive",
    "city": "North Bay",
    "province": "ON"
  },
  {
    "name": "Steele & Associates - TImmins",
    "firm": "Steele & Associates - TImmins",
    "address": "312 Patricia Blvd.",
    "city": "Timmins",
    "province": "ON"
  },
  {
    "name": "Stewart & Milhausen",
    "firm": "Stewart & Milhausen",
    "address": "23 St. Marie Street, Suite 3",
    "city": "Collingwood",
    "province": "ON"
  },
  {
    "name": "T.R. Yuill Appraisal Services",
    "firm": "T.R. Yuill Appraisal Services",
    "address": "675 William Ave. Unit 21",
    "city": "Sudbury",
    "province": "ON"
  },
  {
    "name": "Steve Wilson, CRA",
    "firm": "Talbot Appraisal Services",
    "address": "204 Em St",
    "city": "St Thomas",
    "province": "ON"
  },
  {
    "name": "Tarle & McAllister Appraisals",
    "firm": "Tarle & McAllister Appraisals",
    "address": "408 Pitt St 2nd Floor",
    "city": "Cornwall",
    "province": "ON"
  },
  {
    "name": "Terry Thomas & Associates",
    "firm": "Terry Thomas & Associates",
    "address": "80 Maplehurst Cres.",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "name": "The Appraisal Company",
    "firm": "The Appraisal Company",
    "address": "26 Firelane 11A RR#3",
    "city": "Niagara on the Lake",
    "province": "ON"
  },
  {
    "name": "Demitry Omrin, AACI, P.App",
    "firm": "The Real Estate Consulting Group",
    "address": "55 Eglinton Ave. E. #310",
    "city": "Toronto",
    "province": "ON"
  },
  {
    "name": "Peter Tiller, CRA",
    "firm": "Tiller Appraisals",
    "address": "21 Hopkins Road",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "name": "Michelle Hill",
    "firm": "TM Appraisers Inc.",
    "address": "80 Micro Court, Suite 105",
    "city": "Markham",
    "province": "ON"
  },
  {
    "name": "Calvin Brown, CRA",
    "firm": "Top Class Appraisal",
    "address": "77006-6579 HWY 7",
    "city": "Markham",
    "province": "ON"
  },
  {
    "name": "Carl Blackwood, AACI",
    "firm": "Town & Country Appraisals",
    "address": "158 East 8th Street",
    "city": "Hamilton",
    "province": "ON"
  },
  {
    "name": "Tracey Brisson, CRA",
    "firm": "Tracey Brisson Appraisals",
    "address": "1800 Route 600 West",
    "city": "St. Albert",
    "province": "ON"
  },
  {
    "name": "Tracey Davies, CRA",
    "firm": "Tri County Appraisals",
    "address": "RR #6, 6926 Richmond Road",
    "city": "Aylmer",
    "province": "ON"
  },
  {
    "name": "True North Realty",
    "firm": "True North Realty",
    "address": "20 Stewart Ave.",
    "city": "Kapuskasing",
    "province": "ON"
  },
  {
    "name": "Nick Van Walraven, CRA &  Keith van Walraven, AACI, P.App",
    "firm": "Van Walraven Appraisals Inc.",
    "address": "College Squre, P.O. Box 33053, 1363B Woodroffe Avenue",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "name": "Walker & Walker Appraisal Ltd",
    "firm": "Walker & Walker Appraisal Ltd",
    "address": "211, 2349 Fairview St",
    "city": "Burlington",
    "province": "ON"
  },
  {
    "name": "Pamela Poste, CRA",
    "firm": "Warnica-Poste Appraisals Inc.",
    "address": "16A  Janice Dr",
    "city": "Barrie",
    "province": "ON"
  },
  {
    "name": "Jeffrey Giles, CRA",
    "firm": "Waterside Real Estate Group",
    "address": "110 Mcgregor Crescent",
    "city": "Ancaster",
    "province": "ON"
  },
  {
    "name": "Wayne Elliot Appraisal Services",
    "firm": "Wayne Elliot Appraisal Services",
    "address": "68 Queensway W",
    "city": "Simcoe",
    "province": "ON"
  },
  {
    "name": "Bancroft Appraisal Services",
    "firm": "Wayne White, CRA",
    "address": "P.O. Box 488, 57 Hastings St. N.",
    "city": "Bancroft",
    "province": "ON"
  },
  {
    "name": "Wellington Appraisal",
    "firm": "Wellington Appraisal",
    "address": "340 Woolwich St",
    "city": "Guelph",
    "province": "ON"
  },
  {
    "name": "Westview Appraisal Services",
    "firm": "Westview Appraisal Services",
    "address": "164 - 251 Queen Street South",
    "city": "Mississauga",
    "province": "ON"
  },
  {
    "name": "Andrew Wieland, CRA",
    "firm": "Wieland & Associates",
    "address": "343 Preston Street, suite 1101",
    "city": "Ottawa",
    "province": "ON"
  },
  {
    "name": "Gordon Grant, CRA",
    "firm": "Woodview Real Estate Appraisals",
    "address": "7 - 475 Woodview Road",
    "city": "Burlington",
    "province": "ON"
  },
  {
    "name": "York Simcoe Appraisals Corp",
    "firm": "York Simcoe Appraisals Corp",
    "address": "P O Box 93026",
    "city": "Newmarket",
    "province": "ON"
  },
  {
    "name": "Simon Moore, CRA",
    "firm": "A3 - Accredited Appraisal Associates",
    "address": "93 Edward St",
    "city": "Charlottetown",
    "province": "PE"
  },
  {
    "name": "Bobbi Jo Reardon, AACI,P.App",
    "firm": "Altus Group",
    "address": "161 Maypoint Rd",
    "city": "Charlottetown",
    "province": "PE"
  },
  {
    "name": "Brad Oliver, CRA",
    "firm": "Brad Oliver Realty Inc.",
    "address": "Box 1349, 3 Rink Street",
    "city": "Monteague",
    "province": "PE"
  },
  {
    "name": "David Bradley, CRA",
    "firm": "Bradley Appraisals",
    "address": "257 Central Street",
    "city": "Summerside",
    "province": "PE"
  },
  {
    "name": "Baron Delaney, CRA",
    "firm": "Delaney Appraisal Services",
    "address": "11 Priscilla Place",
    "city": "Cornwall",
    "province": "PE"
  },
  {
    "name": "Kevin Griffin, CRA",
    "firm": "Griffin Appraisal Services",
    "address": "34 Mount Edward Rd",
    "city": "Charlottetown",
    "province": "PE"
  },
  {
    "name": "David Harbord",
    "firm": "Harbord, Rogers & Associates",
    "address": "286 Fitzroy St.",
    "city": "Summerside",
    "province": "PE"
  },
  {
    "name": "Darren Ings, CRA",
    "firm": "Quality Appraisal Services (PEI)",
    "address": "9 Yorkshire Drive",
    "city": "Charlottetown",
    "province": "PE"
  },
  {
    "name": "Alain Girouard, CRA",
    "firm": "9149-1845 Quebec INC",
    "address": "5780, P\u00e9loquin",
    "city": "Laval",
    "province": "QC"
  },
  {
    "name": "Andre Simard, EA",
    "firm": "Bourque,Dupere, Simard & Ass.",
    "address": "162, Boulevard Perron Ouest",
    "city": "New Richmond",
    "province": "QC"
  },
  {
    "name": "Daniel Bouchard, EA",
    "firm": "Daniel Bouchard Evaluateur Agree",
    "address": "1755, boulevard Lemire",
    "city": "Drummondville",
    "province": "QC"
  },
  {
    "name": "Sylvain Savignac, EA",
    "firm": "Devimo Inc.",
    "address": "555, boul. Lacombe Suite 227",
    "city": "Repentigny",
    "province": "QC"
  },
  {
    "name": "Claude Dionne, AACI / EA",
    "firm": "Dionne,Plante & Associers",
    "address": "1491 Jacques Cartier",
    "city": "Mont Joli",
    "province": "QC"
  },
  {
    "name": "Pierre Dufresne, AACI",
    "firm": "Dufresne, Savary & Associes",
    "address": "275 Rue King Ouest",
    "city": "Sherbrooke",
    "province": "QC"
  },
  {
    "name": "Michel Duchesne",
    "firm": "Evaluatech  Chicoutimi/Jonquiere",
    "address": "425 boul. St-Paul",
    "city": "Chicoutimi",
    "province": "QC"
  },
  {
    "name": "Luc Michaud, AACI",
    "firm": "Evaluation 2000",
    "address": "421 Victoria Street",
    "city": "Edmundston",
    "province": "QC"
  },
  {
    "name": "Marc Berube, CRA",
    "firm": "Evaluation Berube INC",
    "address": "1306 Aurele Street",
    "city": "Ottawa",
    "province": "QC"
  },
  {
    "name": "David Leveille",
    "firm": "Evaluation D. Leveille Inc.",
    "address": "440 boul. Albiny-Paquette",
    "city": "Mont Laurier",
    "province": "QC"
  },
  {
    "name": "Eric Bonenfant, CRA",
    "firm": "Evaluation ECB Appraisals",
    "address": "271  Av. Daniel",
    "city": "Ottawa",
    "province": "QC"
  },
  {
    "name": "Karine Paquette",
    "firm": "Evaluation Immobiliere Paquette",
    "address": "1184 rue Dufresne",
    "city": "Saint-Felicien",
    "province": "QC"
  },
  {
    "name": "Jean-paul Perron, CRA",
    "firm": "Evaluation Perron",
    "address": "16 A, CP231",
    "city": "Pointe a la Croix",
    "province": "QC"
  },
  {
    "name": "Patrice Tremblay, CRA",
    "firm": "Evaluation SMP",
    "address": "214, rue De L'Atlas",
    "city": "Quebec",
    "province": "QC"
  },
  {
    "name": "Alain Guy, EA",
    "firm": "Evaluations Immobilieres Evimag Inc.",
    "address": "245, de Gentilly O.",
    "city": "Longueuil",
    "province": "QC"
  },
  {
    "name": "Luc Pelletier, EA",
    "firm": "Evaluations Manicouagan Inc.",
    "address": "872 rue de puyjalon",
    "city": "Baie-Comeau",
    "province": "QC"
  },
  {
    "name": "Marc Vaillancourt, AACI",
    "firm": "Evaluations Mauricie",
    "address": "3130, Notre-Dame-Est",
    "city": "Trois-Rivieres",
    "province": "QC"
  },
  {
    "name": "Yves Gagnon",
    "firm": "Evaluations west-island inc",
    "address": "56, rue Cummings",
    "city": "Sept-Iles",
    "province": "QC"
  },
  {
    "name": "Carol Bellavance, EA",
    "firm": "Godbout, Joseph & Associates",
    "address": "350, av. de la Cath\u00e9drale, 2e \u00e9tage",
    "city": "Rimouski",
    "province": "QC"
  },
  {
    "name": "Alain Girouard, CRA",
    "firm": "Groupe Axival Boivin Coutre",
    "address": "",
    "city": "St-L\u00e9onard",
    "province": "QC"
  },
  {
    "name": "Andre Couture",
    "firm": "Groupe Axival Boivin Couture",
    "address": "8724 boulevard Langelier",
    "city": "St. Leonard",
    "province": "QC"
  },
  {
    "name": "Yvon Poulin, EA",
    "firm": "Groupe Poulin Services Immobiliers Inc",
    "address": "2035, rue du Haut-Bord, bureau 315",
    "city": "Qu\u00e9bec",
    "province": "QC"
  },
  {
    "name": "Louis-Philippe Munoz, EA",
    "firm": "Immobec Inc",
    "address": "2781, Quatre-Bourgeois",
    "city": "Quebec",
    "province": "QC"
  },
  {
    "name": "Joe Tremblay, EA",
    "firm": "Joe Tremblay Inc",
    "address": "40 rue de Sauverny",
    "city": "Candiac",
    "province": "QC"
  },
  {
    "name": "Dominic Godin, EA",
    "firm": "L' Immobiliere societe d evaluation conseil inc",
    "address": "72, Jacques-Cartier Ouest, 4e etage",
    "city": "Chicoutimi",
    "province": "QC"
  },
  {
    "name": "Pascal Arsenault, EA",
    "firm": "Les Evaluations Pascal Arsenault",
    "address": "1201-A, 4ieme avenue",
    "city": "La Pocatiere",
    "province": "QC"
  },
  {
    "name": "Michel Beaudoin, DAR",
    "firm": "Levesque Pires Caron & associes",
    "address": "22, av. Lafleur Nord, bureau 201",
    "city": "Saint-Saveur",
    "province": "QC"
  },
  {
    "name": "Marc Cere",
    "firm": "M.C. Evaluations",
    "address": "179A rue Notre-Dame",
    "city": "Maniwaiki",
    "province": "QC"
  },
  {
    "name": "Frederic Villemure, EA",
    "firm": "Martel Villemure & Chouinard INC",
    "address": "3242 boul. St-Jean",
    "city": "Trois Rivieres",
    "province": "QC"
  },
  {
    "name": "Martin Roch, EA",
    "firm": "Martin Roch Evaluation",
    "address": "492 1e Rue O #6",
    "city": "Amos",
    "province": "QC"
  },
  {
    "name": "Michel Paquin",
    "firm": "Michel Paquin",
    "address": "306-383 boul Greber",
    "city": "Gatineau",
    "province": "QC"
  },
  {
    "name": "Rejean Paris, AACI / EA",
    "firm": "Paris Ladouceur",
    "address": "63 rue de la pointe Langlois",
    "city": "Laval",
    "province": "QC"
  },
  {
    "name": "Bryan L'Archeveque, EA",
    "firm": "PCGCARMON",
    "address": "1336, Fleury Est,",
    "city": "Montreal",
    "province": "QC"
  },
  {
    "name": "Normand Robertson, EA",
    "firm": "PCGCARMON (Laval & St. Jerome Office)",
    "address": "5305, rue Notre-Dame, bureau 207",
    "city": "Laval / St. Jerome",
    "province": "QC"
  },
  {
    "name": "Remy Auclair",
    "firm": "Remy Auclair (Val D'or)",
    "address": "983, 2E Avenue",
    "city": "Val-d'Or",
    "province": "QC"
  },
  {
    "name": "Rene Collard, EA",
    "firm": "Rene Collard, Evaluateur Immobilier Inc",
    "address": "631, des Saules,",
    "city": "Rouyn-Noranda",
    "province": "QC"
  },
  {
    "name": "Stephane Blais, EA",
    "firm": "S. Blais & Associes",
    "address": "1400 Rue St-Louis Bureau 01-001",
    "city": "Gatineau",
    "province": "QC"
  },
  {
    "name": "Louise Pion",
    "firm": "Sylvestre, Leblond & Associes",
    "address": "888 Bourdages Nord",
    "city": "St-Hyacinthe",
    "province": "QC"
  },
  {
    "name": "Andre Leblond",
    "firm": "Sylvestre, Leblond & Associ\u00e9s (Granby)",
    "address": "50 Rue du Centre",
    "city": "Granby",
    "province": "QC"
  },
  {
    "name": "Johanne Trudel, EA",
    "firm": "Trudell,Montcalm & Associes",
    "address": "70 rue O'Keefe # 201",
    "city": "Valleyfield",
    "province": "QC"
  },
  {
    "name": "Vincent Ladouceur, AACI",
    "firm": "Vincent Ladouceur Evaluateur Immobilier Inc",
    "address": "63, rue de la Pointe Langlois",
    "city": "Laval",
    "province": "QC"
  },
  {
    "name": "Yvon Poulin",
    "firm": "Yvon Poulin & Associes Inc",
    "address": "2035, du Haut-Bord, bureau 315",
    "city": "Quebec City",
    "province": "QC"
  },
  {
    "name": "Kevin Kaufmann CRA, David Lazeski CRA",
    "firm": "Associated Appraisal Company",
    "address": "3 \u2013 320 5th Avenue North",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "name": "B.R. Gaffney & Associates",
    "firm": "B.R. Gaffney & Associates",
    "address": "200 Clifton Court, 2330 15th Avenue",
    "city": "Regina",
    "province": "SK"
  },
  {
    "name": "Blue Zephyr Ltd",
    "firm": "Blue Zephyr Ltd",
    "address": "Box 508",
    "city": "Eatonia",
    "province": "SK"
  },
  {
    "name": "Brian Blyth, CRA",
    "firm": "Blyth Agencies",
    "address": "Box 850",
    "city": "Whitewood",
    "province": "SK"
  },
  {
    "name": "Brunsdon Lawrek & Associates, Real Estate Appraisals and Advisory Services",
    "firm": "Brunsdon Lawrek & Associates, Real Estate Appraisals and Advisory Services",
    "address": "204-640 Broadway Avenue",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "name": "Craig E Hellings Appraisals",
    "firm": "Craig E Hellings Appraisals",
    "address": "Box 1824, 411B 310 Main Street North",
    "city": "Moose Jaw",
    "province": "SK"
  },
  {
    "name": "Cross Appraisals",
    "firm": "Cross Appraisals",
    "address": "5172 Wadcana Vista Place",
    "city": "Regina",
    "province": "SK"
  },
  {
    "name": "Crown Appraisals",
    "firm": "Crown Appraisals",
    "address": "2350 - 2nd Avenue",
    "city": "Regina",
    "province": "SK"
  },
  {
    "name": "Dream Home Appraisal Co.",
    "firm": "Dream Home Appraisal Co.",
    "address": "1308 8th Street East",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "name": "David Fortier, AACI,P.App",
    "firm": "Fortier Mattila Appraisals Inc.",
    "address": "461-16th Street W",
    "city": "Battleford",
    "province": "SK"
  },
  {
    "name": "Fox Appraisals",
    "firm": "Fox Appraisals",
    "address": "8319 Kestral Drive",
    "city": "Regina",
    "province": "SK"
  },
  {
    "name": "Gerein Appraisals",
    "firm": "Gerein Appraisals",
    "address": "Box 20032",
    "city": "Yorkton",
    "province": "SK"
  },
  {
    "name": "Gordon Lawson Real Estate Appraisals & Consulting",
    "firm": "Gordon Lawson Real Estate Appraisals & Consulting",
    "address": "505 Guelph Cres",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "name": "Just North of Appraisals",
    "firm": "Just North of Appraisals",
    "address": "Box 13",
    "city": "Choiceland",
    "province": "SK"
  },
  {
    "name": "McInnes & Company Appraisals",
    "firm": "McInnes & Company Appraisals",
    "address": "Suite 201, 5303-50 Avenue",
    "city": "Lloydminster",
    "province": "SK"
  },
  {
    "name": "Michael Fox Valuations Inc",
    "firm": "Michael Fox Valuations Inc",
    "address": "7531 Hearne Bay",
    "city": "Regina",
    "province": "SK"
  },
  {
    "name": "Rosanne Wood, CRA",
    "firm": "Pinnacle Appraisals (now associated with Brunsdon Lawrek & Associates)",
    "address": "2546 Broderick Road",
    "city": "Regina",
    "province": "SK"
  },
  {
    "name": "Mark Dean, AACI",
    "firm": "Precision Appraisal Services",
    "address": "113 Burrows Ave W",
    "city": "Melfort",
    "province": "SK"
  },
  {
    "name": "Ring Appraisals Ltd",
    "firm": "Ring Appraisals Ltd",
    "address": "140 - 12th St, E",
    "city": "Prince Albert",
    "province": "SK"
  },
  {
    "name": "Adam Vanjoff, CRA",
    "firm": "Riverside Appraisals Ltd.",
    "address": "1325 Spadina Crescent East",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "name": "Rolling Thunder Enterprises",
    "firm": "Rolling Thunder Enterprises",
    "address": "Box 1858",
    "city": "Unity",
    "province": "SK"
  },
  {
    "name": "Royal Lepage - Myrah Appraisals",
    "firm": "Royal Lepage - Myrah Appraisals",
    "address": "812 Victoria Ave E",
    "city": "Regina",
    "province": "SK"
  },
  {
    "name": "Suncorp Valuations Ltd",
    "firm": "Suncorp Valuations Ltd",
    "address": "300 - 261 1st Avenue North",
    "city": "Saskatoon",
    "province": "SK"
  },
  {
    "name": "Sutton Group Results Realty",
    "firm": "Sutton Group Results Realty",
    "address": "3904 B Gordon Road",
    "city": "Regina",
    "province": "SK"
  },
  {
    "name": "Sohaib Ansari, AACI",
    "firm": "SUTY Consulting Inc",
    "address": "52 Goldenglow Drive",
    "city": "Moose Jaw",
    "province": "SK"
  },
  {
    "name": "Tri-J Appraisals",
    "firm": "Tri-J Appraisals",
    "address": "1222 2nd St.",
    "city": "Estevan",
    "province": "SK"
  },
  {
    "name": "United Appraisals",
    "firm": "United Appraisals",
    "address": "48 Longpre Crescent",
    "city": "Prince Albert",
    "province": "SK"
  },
  {
    "name": "John Warkentin, AACI, P.App",
    "firm": "Warkentin Appraisal Services",
    "address": "1706 Springs Drive",
    "city": "Swift Current",
    "province": "SK"
  },
  {
    "name": "Western Appraisals",
    "firm": "Western Appraisals",
    "address": "1652-100th Street",
    "city": "North Battleford",
    "province": "SK"
  }
];

export const LENDER_APPROVED_ATTACHMENTS: Record<string, { appraiser?: LenderAttachmentItem[]; lawyer?: LenderAttachmentItem[] }> = {
  "CMLS Financial": {
    "appraiser": [
      {
        "title": "CMLS Approved Appraiser Directory (National)",
        "fileName": "approved-appraisers.xlsx",
        "localPath": "/forms/cmls-financial/approved-appraisers.xlsx",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/zp3Vo3jDYNjkVUCZJAbu6VLWE9eYjyn07djnxb2z.xlsx",
        "format": "XLSX",
        "fileSize": "76.7 KB",
        "itemCount": 524,
        "description": "Master list of 524 accredited appraisal firms approved by CMLS Financial across Canada."
      },
      {
        "title": "CMLS Appraisal Requirements & Guidelines",
        "fileName": "appraisal-requirements.pdf",
        "localPath": "/forms/cmls-financial/appraisal-requirements.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/QUe10YgTjG90rW04LX75dhrjSl7NoB8t5C7SNE73.pdf",
        "format": "PDF",
        "fileSize": "200.7 KB",
        "description": "Appraisal underwriting standards, report age limits, and acceptable AMC ordering protocols."
      }
    ]
  },
  "CMLS AVEO": {
    "appraiser": [
      {
        "title": "AVEO Approved Appraisers List",
        "fileName": "approved-appraisers-list.xlsx",
        "localPath": "/forms/aveo-by-cmls-financial/approved-appraisers-list.xlsx",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/9rV9eltORVCvChJcr0IOUXsAa45VEu0fqHIWZtMN.xlsx",
        "format": "XLSX",
        "fileSize": "89.5 KB",
        "itemCount": 576,
        "description": "576 approved appraisal firms and designated appraisers for CMLS AVEO alternative mortgage files."
      }
    ]
  },
  "Prospera": {
    "lawyer": [
      {
        "title": "Prospera Approved List of Lawyers & Notaries Public (BC)",
        "fileName": "approved-list-of-lawyers-notary.xlsx",
        "localPath": "/forms/prospera/approved-list-of-lawyers-notary.xlsx",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/aWaUAbvxw97QdF7W4fONiIujK2KVltwo3W9V718w.xlsx",
        "format": "XLSX",
        "fileSize": "52.5 KB",
        "itemCount": 235,
        "description": "Complete panel of 235 approved law firms and BC Notaries Public across Lower Mainland and Okanagan."
      }
    ]
  },
  "Coast Capital Savings": {
    "appraiser": [
      {
        "title": "Coast Capital Approved Appraisers List",
        "fileName": "approved-appraisers.pdf",
        "localPath": "/forms/coast-capital-savings/approved-appraisers.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/lgn0LuPbVsmvulyA9LG8fte2ljFn41EVCR18UTNc.pdf",
        "format": "PDF",
        "fileSize": "243.7 KB",
        "description": "Designated appraisal firms authorized to complete residential valuations for Coast Capital."
      }
    ],
    "lawyer": [
      {
        "title": "Coast Capital Approved Law Firms Panel",
        "fileName": "approved-law-firms.pdf",
        "localPath": "/forms/coast-capital-savings/approved-law-firms.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/4QQB0GzXaOv8xQGOYxgJZEdv8Cryhmpee5EuyW4t.pdf",
        "format": "PDF",
        "fileSize": "1.06 MB",
        "description": "Comprehensive panel of authorized solicitor and notary law firms for mortgage document execution."
      }
    ]
  },
  "Coastal Community": {
    "appraiser": [
      {
        "title": "Coastal Community Approved Appraiser List",
        "fileName": "appraiser-list.pdf",
        "localPath": "/forms/coastal-community/appraiser-list.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/GgsuVT16MBgOPg2mqKbruEELICpd8SGlWx44fRrP.pdf",
        "format": "PDF",
        "fileSize": "627.8 KB",
        "description": "Approved appraisers for Vancouver Island and Gulf Islands properties."
      }
    ],
    "lawyer": [
      {
        "title": "Coastal Community Approved Solicitors List",
        "fileName": "solicitors-list.pdf",
        "localPath": "/forms/coastal-community/solicitors-list.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/Zn4unrkCgUVpSjGxuI024rxzddmH4tKFvs1DfXpM.pdf",
        "format": "PDF",
        "fileSize": "720.2 KB",
        "description": "Approved legal counsel list for Coastal Community Credit Union mortgage registration."
      }
    ]
  },
  "CTBC Bank": {
    "lawyer": [
      {
        "title": "CTBC Bank Approved Lawyer List",
        "fileName": "approved-lawyer-list.doc",
        "localPath": "/forms/ctbc-bank/approved-lawyer-list.doc",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/iVLyw5BAYxGHlQykfp4LDqgoIZ9AYdHRKS42pkDW.doc",
        "format": "DOC",
        "fileSize": "246.0 KB",
        "description": "Mandatory approved solicitor panel for CTBC Bank Canadian residential and commercial mortgages."
      }
    ]
  },
  "RFA Bank": {
    "appraiser": [
      {
        "title": "RFA Approved Appraisal List (National)",
        "fileName": "rfa-approved-appraisal-list.xlsx",
        "localPath": "/forms/rfa/rfa-approved-appraisal-list.xlsx",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/JkuXx7Zq38jBmkOOLndiABG8SO0tG6vUfE3igzbl.xlsx",
        "format": "XLSX",
        "fileSize": "59.5 KB",
        "itemCount": 852,
        "description": "852 approved appraisal firms authorized by RFA across British Columbia, Alberta, and Ontario."
      }
    ]
  },
  "RFA Alternative": {
    "appraiser": [
      {
        "title": "RFA Approved Appraisal List (National)",
        "fileName": "rfa-approved-appraisal-list.xlsx",
        "localPath": "/forms/rfa/rfa-approved-appraisal-list.xlsx",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/JkuXx7Zq38jBmkOOLndiABG8SO0tG6vUfE3igzbl.xlsx",
        "format": "XLSX",
        "fileSize": "59.5 KB",
        "itemCount": 852,
        "description": "852 approved appraisal firms authorized by RFA across British Columbia, Alberta, and Ontario."
      }
    ]
  },
  "Strive Capital Corporation (Aspire)": {
    "appraiser": [
      {
        "title": "Aspire Approved Appraisers List (British Columbia)",
        "fileName": "aspire-approved-appraisers-list-british-columbia.pdf",
        "localPath": "/forms/aspire-by-strive-capital/aspire-approved-appraisers-list-british-columbia.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/9UFUH2KRgN9EnL1gnnQkI87um2qMkPEkHontnJu0.pdf",
        "format": "PDF",
        "fileSize": "919.7 KB",
        "description": "Approved residential appraisers for Aspire / Strive Capital across British Columbia."
      },
      {
        "title": "Aspire Approved Appraisers List (Alberta)",
        "fileName": "aspire-approved-appraisers-list-alberta.pdf",
        "localPath": "/forms/aspire-by-strive-capital/aspire-approved-appraisers-list-alberta.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/f6gIfsnfGxsWxUvcqKxLvbrvF0rkz5DRej3F8dAu.pdf",
        "format": "PDF",
        "fileSize": "130.3 KB",
        "description": "Approved residential appraisers for Aspire / Strive Capital across Alberta."
      },
      {
        "title": "Aspire Approved Appraisers List (Ontario)",
        "fileName": "asprire-approved-appraisers-list-for-ontario.pdf",
        "localPath": "/forms/aspire-by-strive-capital/asprire-approved-appraisers-list-for-ontario.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/l7J8u0yQcA5TtpsZMvp2i5BbfEKEW4b4pRZjGLva.pdf",
        "format": "PDF",
        "fileSize": "110.5 KB",
        "description": "Approved residential appraisers for Aspire / Strive Capital across Ontario."
      },
      {
        "title": "Strive Appraisal Guidelines",
        "fileName": "appraisal-guidelines.pdf",
        "localPath": "/forms/strive/appraisal-guidelines.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/uYHX5yGprd3OdmD7tCiKzqoif9RytzsnCFCxLAyD.pdf",
        "format": "PDF",
        "fileSize": "164.4 KB",
        "description": "Strive Capital appraisal validity requirements, AVM threshold limits, and re-address letters."
      }
    ]
  },
  "Aspire (Strive Capital)": {
    "appraiser": [
      {
        "title": "Aspire Approved Appraisers List (British Columbia)",
        "fileName": "aspire-approved-appraisers-list-british-columbia.pdf",
        "localPath": "/forms/aspire-by-strive-capital/aspire-approved-appraisers-list-british-columbia.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/9UFUH2KRgN9EnL1gnnQkI87um2qMkPEkHontnJu0.pdf",
        "format": "PDF",
        "fileSize": "919.7 KB",
        "description": "Approved residential appraisers for Aspire across British Columbia."
      },
      {
        "title": "Aspire Approved Appraisers List (Alberta)",
        "fileName": "aspire-approved-appraisers-list-alberta.pdf",
        "localPath": "/forms/aspire-by-strive-capital/aspire-approved-appraisers-list-alberta.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/f6gIfsnfGxsWxUvcqKxLvbrvF0rkz5DRej3F8dAu.pdf",
        "format": "PDF",
        "fileSize": "130.3 KB",
        "description": "Approved residential appraisers for Aspire across Alberta."
      },
      {
        "title": "Aspire Approved Appraisers List (Ontario)",
        "fileName": "asprire-approved-appraisers-list-for-ontario.pdf",
        "localPath": "/forms/aspire-by-strive-capital/asprire-approved-appraisers-list-for-ontario.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/l7J8u0yQcA5TtpsZMvp2i5BbfEKEW4b4pRZjGLva.pdf",
        "format": "PDF",
        "fileSize": "110.5 KB",
        "description": "Approved residential appraisers for Aspire across Ontario."
      }
    ]
  },
  "EQ Bank Alternative (Equitable)": {
    "appraiser": [
      {
        "title": "EQ Bank Approved Appraisers (British Columbia)",
        "fileName": "approved-appraisers-bc.pdf",
        "localPath": "/forms/eq-bank/approved-appraisers-bc.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/TmqTCxRCITqkrakZmXkKNximYGX0KuJnZQfk20HL.pdf",
        "format": "PDF",
        "fileSize": "453.8 KB",
        "description": "Official panel of approved appraisers for Equitable Bank / EQ Bank in British Columbia."
      }
    ],
    "lawyer": [
      {
        "title": "Certificate of Independent Legal Advice (Borrower)",
        "fileName": "certificate-of-independent-legal-advice-borrower.pdf",
        "localPath": "/forms/eq-bank/certificate-of-independent-legal-advice-borrower.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/awEkn8uaqH173k9TVbCZE0vQceoJ8JSAE8krouXW.pdf",
        "format": "PDF",
        "fileSize": "138.2 KB",
        "description": "Mandatory ILA certificate required for non-standard borrower structures."
      },
      {
        "title": "Certificate of Independent Legal Advice (Non-Title Holding Spouse)",
        "fileName": "certificate-of-independent-legal-advice-non-title-holding-spouse.pdf",
        "localPath": "/forms/eq-bank/certificate-of-independent-legal-advice-non-title-holding-spouse.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/agU7wW5KOntzBnbaPNmi5moqvXcfv9J6Hu5zEzf4.pdf",
        "format": "PDF",
        "fileSize": "140.0 KB",
        "description": "Mandatory matrimonial ILA form required under BC and Canadian family law."
      }
    ]
  },
  "Equitable Bank": {
    "appraiser": [
      {
        "title": "Equitable Bank Approved Appraisers (British Columbia)",
        "fileName": "approved-appraisers-bc.pdf",
        "localPath": "/forms/eq-bank/approved-appraisers-bc.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/TmqTCxRCITqkrakZmXkKNximYGX0KuJnZQfk20HL.pdf",
        "format": "PDF",
        "fileSize": "453.8 KB",
        "description": "Official panel of approved appraisers for Equitable Bank in British Columbia."
      }
    ],
    "lawyer": [
      {
        "title": "Certificate of Independent Legal Advice (Borrower)",
        "fileName": "certificate-of-independent-legal-advice-borrower.pdf",
        "localPath": "/forms/eq-bank/certificate-of-independent-legal-advice-borrower.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/awEkn8uaqH173k9TVbCZE0vQceoJ8JSAE8krouXW.pdf",
        "format": "PDF",
        "fileSize": "138.2 KB",
        "description": "Mandatory ILA certificate required for borrower legal execution."
      }
    ]
  },
  "Home Trust": {
    "lawyer": [
      {
        "title": "Home Trust Solicitor Declaration",
        "fileName": "solicitor-declaration.pdf",
        "localPath": "/forms/home-trust/solicitor-declaration.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/n6Ui6EWOOw4sQqjWmGnAsLDUO51hzdMrfhT0T1P5.pdf",
        "format": "PDF",
        "fileSize": "83.6 KB",
        "description": "Mandatory closing declaration required from borrower's solicitor prior to mortgage funding."
      },
      {
        "title": "Certificate of Independent Legal Advice",
        "fileName": "certificate-of-independent-legal-advice.pdf",
        "localPath": "/forms/home-trust/certificate-of-independent-legal-advice.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/qlhCVqyixKI7wzmBrXyph77pLkGH0RH2nchJYVC4.pdf",
        "format": "PDF",
        "fileSize": "284.3 KB",
        "description": "Required for all non-borrowing spouses and third-party guarantors."
      }
    ]
  },
  "Home Trust Classic": {
    "lawyer": [
      {
        "title": "Home Trust Solicitor Declaration",
        "fileName": "solicitor-declaration.pdf",
        "localPath": "/forms/home-trust/solicitor-declaration.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/n6Ui6EWOOw4sQqjWmGnAsLDUO51hzdMrfhT0T1P5.pdf",
        "format": "PDF",
        "fileSize": "83.6 KB",
        "description": "Mandatory closing declaration required from borrower's solicitor for Classic B deals."
      },
      {
        "title": "Certificate of Independent Legal Advice",
        "fileName": "certificate-of-independent-legal-advice.pdf",
        "localPath": "/forms/home-trust/certificate-of-independent-legal-advice.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/qlhCVqyixKI7wzmBrXyph77pLkGH0RH2nchJYVC4.pdf",
        "format": "PDF",
        "fileSize": "284.3 KB",
        "description": "Required for third-party guarantors and non-borrowing owners."
      }
    ]
  },
  "Eclipse (MCAP & RMG)": {
    "appraiser": [
      {
        "title": "Eclipse Approved Appraiser List",
        "fileName": "appraiser-list.xlsx",
        "localPath": "/forms/eclipse-mcap-rmg/appraiser-list.xlsx",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/IRpARI8Hs2C2PRQSxgo2tu22Ix2AsCB464ZPYEhd.xlsx",
        "format": "XLSX",
        "fileSize": "156.4 KB",
        "description": "Approved appraiser directory for Eclipse alternative mortgage submissions."
      }
    ]
  },
  "RMG Mortgages": {
    "appraiser": [
      {
        "title": "RMG Approved Appraiser List",
        "fileName": "approved-appraiser-list.pdf",
        "localPath": "/forms/rmg-mortgages/approved-appraiser-list.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/5P6CkP0T8HQcWXUNL4yq1ARs5R1ofXp3cLlJBvdp.pdf",
        "format": "PDF",
        "fileSize": "327.1 KB",
        "description": "Designated appraisal firms approved by RMG Mortgages."
      },
      {
        "title": "RMG Appraisal Rebate Request",
        "fileName": "appraisal-rebate.pdf",
        "localPath": "/forms/rmg-mortgages/appraisal-rebate.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/Jqpzf8eQaJiRRVBxdkigPVi0TXj4Dhbe6Ny84KTB.pdf",
        "format": "PDF",
        "fileSize": "402.3 KB",
        "description": "Rebate reimbursement form for qualifying promotional broker files."
      }
    ]
  },
  "Questbank": {
    "appraiser": [
      {
        "title": "Questbank BC Approved Appraisers List",
        "fileName": "bc-appraisers-list.pdf",
        "localPath": "/forms/questbank/bc-appraisers-list.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/MjeUeCBE8pGDLK04EyqhJaPcdMsz6inDOH05QXKi.pdf",
        "format": "PDF",
        "fileSize": "76.3 KB",
        "description": "Authorized residential appraisers for Questbank mortgage transactions in British Columbia."
      }
    ]
  },
  "NPX (MERIX)": {
    "appraiser": [
      {
        "title": "NPX Approved Appraisers (Western Canada)",
        "fileName": "npx-approved-appraisers-western-canada.pdf",
        "localPath": "/forms/npx/npx-approved-appraisers-western-canada.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/1EeSnmeWK8oRDtEbxcKbUC9RRlsPUcZbMeqDKRMG.pdf",
        "format": "PDF",
        "fileSize": "231.3 KB",
        "description": "Approved appraisers for NPX near-prime mortgages across British Columbia and Alberta."
      }
    ]
  },
  "WealthONE Bank of Canada": {
    "appraiser": [
      {
        "title": "WealthONE Bank Approved Appraisal List",
        "fileName": "appraisal-list.pdf",
        "localPath": "/forms/wealthone-bank/appraisal-list.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/hkfyLughBN5LuxU4h4nG2yEok00uyc4ovWNHgZjz.pdf",
        "format": "PDF",
        "fileSize": "1.06 MB",
        "description": "Accredited appraisal firms authorized by WealthONE Bank."
      }
    ]
  },
  "FirstOntario Credit Union": {
    "appraiser": [
      {
        "title": "FirstOntario Approved Appraisal List",
        "fileName": "appraisal-list.pdf",
        "localPath": "/forms/firstontario-credit-union/appraisal-list.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/NgfRjJA1T9BI97QEjFNfe57dbEQYKbqEEZQ7Wrvy.pdf",
        "format": "PDF",
        "fileSize": "486.5 KB",
        "description": "Approved appraisal panel for FirstOntario Credit Union residential mortgages."
      }
    ]
  },
  "FirstOntario Credit Union (Alt A)": {
    "appraiser": [
      {
        "title": "FirstOntario Alt A Appraisal List",
        "fileName": "appraisal-list.pdf",
        "localPath": "/forms/firstontario-credit-union-alt-a/appraisal-list.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/37cFwGHvCCq9Kv31EbeJLt49IbeD097Aao483fQd.pdf",
        "format": "PDF",
        "fileSize": "486.5 KB",
        "description": "Approved appraisal panel for FirstOntario Alt A residential mortgages."
      }
    ]
  },
  "Effort Trust": {
    "appraiser": [
      {
        "title": "Effort Trust Appraisal List",
        "fileName": "appraisal-list.pdf",
        "localPath": "/forms/effort-trust/appraisal-list.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/gJtrtNCOp1uAMHBdc0Ran7qjA2NCIRjSnujVJoKs.pdf",
        "format": "PDF",
        "fileSize": "320.0 KB",
        "description": "Approved appraisal firms for Effort Trust mortgage transactions."
      }
    ]
  },
  "Glasslake Funding": {
    "appraiser": [
      {
        "title": "Glasslake Preferred Appraiser List",
        "fileName": "glasslake-preferred-appraiser-list.pdf",
        "localPath": "/forms/glasslake-funding/glasslake-preferred-appraiser-list.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/gKUGOWKWbzcEilm9xpOM6a2GLx7r1L45XMAMlYqb.pdf",
        "format": "PDF",
        "fileSize": "278.0 KB",
        "description": "Preferred appraisal panel for Glasslake residential funding."
      }
    ]
  },
  "Ganaraska Financial Credit Union": {
    "appraiser": [
      {
        "title": "Ganaraska Approved Appraisers",
        "fileName": "approved-appraisers.pdf",
        "localPath": "/forms/ganaraska-financial-credit-union/approved-appraisers.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/LnQbSEsCM8HRaUcP6Q0tHQ2fdz36YnUOK4yoUdbf.pdf",
        "format": "PDF",
        "fileSize": "611.0 KB",
        "description": "Authorized appraisal firms for Ganaraska Financial Credit Union."
      }
    ]
  },
  "Servus Credit Union": {
    "appraiser": [
      {
        "title": "Servus Credit Union Appraisal List",
        "fileName": "appraisal-list.pdf",
        "localPath": "/forms/servus-credit-union/appraisal-list.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/UMkagHRXjMZ92l28aOoDZXlaY8Ghz1Bd862AnOC1.pdf",
        "format": "PDF",
        "fileSize": "75.9 KB",
        "description": "Approved residential appraiser list for Servus Credit Union."
      }
    ]
  },
  "Merix Financial": {
    "appraiser": [
      {
        "title": "Merix Financial Approved Appraiser List",
        "fileName": "appraiser-list.xls",
        "localPath": "/forms/merix-standard-lendwise/appraiser-list.xls",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/zawILVhymDNV9KdHgWAD9rJwApDETRZjQmuUsrRg.xls",
        "format": "XLS",
        "fileSize": "225.5 KB",
        "description": "Master approved appraiser list for Merix Financial and Lendwise."
      }
    ]
  },
  "Scotiabank": {
    "lawyer": [
      {
        "title": "Certificate of Independent Legal Advice",
        "fileName": "certificate-of-independent-legal-advice.pdf",
        "localPath": "/forms/scotiabank/certificate-of-independent-legal-advice.pdf",
        "remoteUrl": "https://d14sntax4572qq.cloudfront.net/forms/cYUXnipxrjHTQqUDn7EY6N7RkHPFsysdZXAJ1ruQ.pdf",
        "format": "PDF",
        "fileSize": "52.8 KB",
        "description": "Mandatory ILA certificate for matrimonial non-owner consent and guarantors."
      }
    ]
  }
};
