# Give the AUTO-registered Miami source keys a real credible rationale + name in data/sources.json (run under the lock).
import json
R={
"AJC":("Atlanta Journal-Constitution (travel)","Major Southeast daily; staff travel piece on Everglades destinations.",3),
"CAPLINNEWS":("Caplin News (FIU)","FIU journalism school's newsroom covering Miami neighbourhoods; local, bylined.",3),
"CORALGABLES":("City of Coral Gables (official)","Municipal official attractions page.",2),
"CRAZYTOURIST":("The Crazy Tourist","Travel listicle site — corroborating only, never paired alone with another weak source.",4),
"CULTURETRIP":("Culture Trip","Established travel publisher with bylined destination guides.",3),
"DINERSCLUB":("Diners Club Travel","Card-issuer travel editorial — corroborating only.",4),
"EARTHTREKKERS":("Earth Trekkers","Long-running, widely-read national-parks travel blog (Julie & Tim Rivenbark); detailed first-hand park guides.",3),
"FLORIDARAMBLER":("Florida Rambler","Veteran Florida travel site by former Sun Sentinel journalists; first-hand Old Florida coverage.",3),
"FODORS":("Fodor's Travel","Established guidebook publisher with edited listings.",2),
"FOXNEWS":("Fox News (food)","National news outlet; feature on Robert Is Here's 50th anniversary.",3),
"FROMMERS":("Frommer's","Established guidebook publisher with edited listings.",2),
"GLOBALPHILE":("Globalphile","Travel blog — corroborating only.",4),
"GULFSHOREBUSINESS":("Gulfshore Business","Southwest Florida business magazine; bylined Redland feature.",3),
"ISLANDS":("Islands (islands.com)","National travel magazine brand; bylined Ochopee feature.",3),
"LONELYPLANET":("Lonely Planet","Leading guidebook publisher; edited must-see listings.",2),
"MIAMILIVING":("Miami Living Magazine","Local lifestyle magazine; full 2026 Michelin list (used to corroborate the award list).",3),
"MICHELIN_EDITORIAL":("MICHELIN Guide editorial (best-of articles)","Michelin's editorial round-ups — ONE ordinary source, never the lone-authority award (key hygiene).",2),
"NATGEO":("National Geographic Travel","Major travel publisher; Everglades activities guide.",2),
"NBCNEWS":("NBC News","National news; features on Robert Is Here and Coopertown airboats.",2),
"NRHP":("National Register of Historic Places (NPS travel itinerary)","Federal historic designation listing — corroborates history, not an operator authority.",2),
"PARADISECOAST":("Naples, Marco Island, Everglades CVB (Paradise Coast)","Official Collier County tourism board — Everglades City dining.",2),
"ROADSIDEAMERICA":("Roadside America","Long-running authority on US roadside attractions, user tips edited.",3),
"SHAKAGUIDE":("Shaka Guide","GPS audio-tour publisher with researched national-park itineraries.",3),
}
s=json.load(open('data/sources.json'))
m=s['cities']['miami-fl']['sources']
it = m if isinstance(m,list) else list(m.values())
n=0
for x in it:
    if x['key'] in R and 'AUTO-registered' in x.get('credible',''):
        x['name'],x['credible'],x['rank']=R[x['key']]; n+=1
json.dump(s,open('data/sources.json','w'),indent=2,ensure_ascii=False); open('data/sources.json','a').write('\n')
print("updated",n)
