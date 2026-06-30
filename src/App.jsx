import { useState, useRef, useEffect } from "react";
import { supabase, signUp, signIn, signOut, getProfile, upsertProfile, deleteProfile, getApprovedProfiles, getAllProfiles, uploadPhoto, sendMessage, getMessages, likeProfile, getLikes } from "./supabase.js";

// ⚠️ Verander dit wachtwoord naar iets eigens voordat je live gaat!
const ADMIN_PASSWORD = "Hetkomtgoedschatje";

const C = {
  cream: "#FDF6EC", sand: "#F2E4CC", terra: "#C4622D",
  terradark: "#9E4A1E", sage: "#7A9E7E", charcoal: "#2C2C2C",
  muted: "#8A7968", white: "#FFFFFF", blush: "#F4C9A8",
};

const PROFILES = [
  {
    id: 1, name: "Sofia", age: 28, city: "Amsterdam", country: "🇳🇱 Netherlands",
    tagline: "Slow travel & strong coffee", role: "buddy", verified: true,
    bio: "I've been living out of a suitcase for 3 years — not because I'm lost, but because I keep finding places worth staying. looking for a travel buddy who appreciates farmers markets over tourist traps.",
    interests: ["Hiking", "Photography", "Local cuisine", "Jazz bars"],
    languages: ["English", "Dutch", "Spanish"],
    avatar: "https://i.pravatar.cc/400?img=47",
    photos: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80","https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80"],
    travelStyle: "Slow explorer", nextDestination: "Lisbon, Portugal",
    tripDuration: "2–4 weeks", budget: "Mid-range", lookingFor: "Co-traveller & local host",
  },
  {
    id: 2, name: "Marcus", age: 31, city: "Berlin", country: "🇩🇪 Germany",
    tagline: "Cosy rooms, big adventures nearby", role: "owner", verified: true,
    bio: "Former software engineer who turned a 200-year-old farmhouse into a boutique BnB. Every guest gets a hand-written local map and a jar of homemade jam.",
    interests: ["Rock climbing", "Street art", "Tech meetups", "Cycling"],
    languages: ["English", "German", "Portuguese"],
    avatar: "https://i.pravatar.cc/400?img=68",
    photos: ["https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=400&q=80","https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&q=80"],
    propertyName: "Farmhaus am See", propertyType: "Farmhouse B&B",
    rooms: 3, pricePerNight: "€65–€90",
    amenities: ["Garden", "Bike rental", "Breakfast included", "EV charger"],
    hostingSince: "2021",
  },
  {
    id: 3, name: "Yuki", age: 26, city: "Tokyo", country: "🇯🇵 Japan",
    tagline: "Ramen routes & mountain huts", role: "buddy", verified: false,
    bio: "I work remotely as a designer and spend half my year in Japan, the other half wherever the seasons are best. I love quiet moments — a misty mountain trail, a tiny ramen shop at midnight.",
    interests: ["Onsen", "Illustration", "Night markets", "Bouldering"],
    languages: ["Japanese", "English", "French"],
    avatar: "https://i.pravatar.cc/400?img=49",
    photos: ["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80","https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80"],
    travelStyle: "Mindful wanderer", nextDestination: "Kyoto → Osaka",
    tripDuration: "1–2 weeks", budget: "Budget-friendly", lookingFor: "Female travel companion",
  },
  {
    id: 4, name: "Diego", age: 34, city: "Buenos Aires", country: "🇦🇷 Argentina",
    tagline: "Casa con sabor — a home with flavour", role: "owner", verified: true,
    bio: "Chef by trade, host by passion. I converted the ground floor of my colonial home into a cosy guesthouse. Guests wake up to freshly baked medialunas and can join my cooking evenings.",
    interests: ["Cooking", "Dance", "Trekking", "Wine"],
    languages: ["Spanish", "English", "Italian"],
    avatar: "https://i.pravatar.cc/400?img=57",
    photos: ["https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=400&q=80","https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80"],
    propertyName: "Casa Sabor", propertyType: "Colonial Guesthouse",
    rooms: 2, pricePerNight: "$40–$60",
    amenities: ["Home-cooked breakfast", "Cooking classes", "Rooftop terrace", "City tours"],
    hostingSince: "2019",
  },
  {
    id: 5, name: "Amara", age: 29, city: "Lagos", country: "🇳🇬 Nigeria",
    tagline: "Sunsets & spontaneity", role: "buddy", verified: true,
    bio: "Marketing consultant who's learned that the world looks different from every timezone. I prefer street food over fine dining, local buses over Ubers, and unplanned afternoons over packed itineraries.",
    interests: ["Music festivals", "Surfing", "Writing", "Afrobeats"],
    languages: ["English", "Yoruba", "French"],
    avatar: "https://i.pravatar.cc/400?img=45",
    photos: ["https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&q=80","https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=400&q=80"],
    travelStyle: "Spontaneous roamer", nextDestination: "Dakar, Senegal",
    tripDuration: "10–14 days", budget: "Flexible", lookingFor: "Anyone adventurous!",
  },
  {
    id: 6, name: "Lena", age: 27, city: "Stockholm", country: "🇸🇪 Sweden",
    tagline: "A writer's retreat in the forest", role: "owner", verified: false,
    bio: "Environmental researcher with a converted cabin on the edge of a pine forest. Ideal for solo travellers who need peace, or couples who want to hike and stargaze.",
    interests: ["Ecology", "Nordic skiing", "Poetry readings", "Coffee ritual"],
    languages: ["Swedish", "English", "German"],
    avatar: "https://i.pravatar.cc/400?img=44",
    photos: ["https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"],
    propertyName: "Skogen Cabin", propertyType: "Forest Cabin",
    rooms: 1, pricePerNight: "€80–€110",
    amenities: ["Wood-fire sauna", "Forest trails", "Stargazing deck", "Full kitchen"],
    hostingSince: "2022",
  },
];

const MESSAGES_INIT = {
  1: [{ from: "them", text: "Hey! Saw you're heading to Lisbon too 🌊" }, { from: "me", text: "Yes! End of October — perfect weather" }],
  2: [{ from: "them", text: "Tbilisi is incredible — have you been?" }],
  4: [{ from: "them", text: "I made kokotxas last week. You'd love it." }, { from: "me", text: "Send the recipe!! 😭" }],
};

const INTERESTS_LIST = ["Hiking","Photography","Cooking","Cycling","Surfing","Music","Art","Wine","Reading","Yoga","Dancing","Climbing","Nature","Nightlife","History","Markets"];
const LANGUAGES_LIST = ["English","Dutch","German","French","Spanish","Italian","Portuguese","Japanese","Arabic","Swedish","Polish","Turkish"];
const VAARDIGHEDEN = ["Kamers schoonmaken","Tuin onderhouden","Dieren verzorgen","Koken","Rijbewijs","Reserveringen bijhouden","In en uitchecken","Gasten informeren over bestemming","Sleutelbeheer","Administratie bijhouden","Kleine reparaties","Zwembad onderhouden","Boodschappen doen","Babysitter/kinderopvang"];
const PROPERTY_TYPES = ["Private room","Entire apartment","Farmhouse B&B","Cabin / Retreat","Boutique guesthouse","Villa","Treehouse","Houseboat"];
const AMENITIES_LIST = ["Breakfast included","WiFi","Parking","Garden","Pool","Sauna","Bike rental","Kitchen","Pets allowed","EV charger","Workspace","City tours"];
const MAANDEN = ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];
const DURATIONS = ["Weekend","1 week","1-2 weeks","2-4 weeks","1+ month","Flexible"];
const AANTAL_PERSONEN = ["Ik kom alleen","Ik kom met partner"];

// ── STYLES ───────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Prata&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#FDF6EC;color:#2C2C2C;min-height:100vh;}
.wrap{max-width:430px;margin:0 auto;min-height:100vh;background:#FDF6EC;position:relative;}
.nav{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;background:#FDF6EC;border-bottom:1px solid #F2E4CC;position:sticky;top:0;z-index:50;}
.nav-logo{font-family:'Prata',serif;font-size:22px;color:#C4622D;font-weight:800;}
.nav-logo span{font-style:italic;color:#7A9E7E;}
.nav-actions{display:flex;gap:10px;align-items:center;}
.btn-nav{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#8A7968;padding:6px 14px;border-radius:20px;transition:all 0.2s;}
.btn-nav:hover{color:#C4622D;background:#F2E4CC;}
.btn-nav.primary{background:#C4622D;color:white;}
.btn-nav.primary:hover{background:#9E4A1E;}
.nav-avatar{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid #F4C9A8;cursor:pointer;}
.hero{padding:28px 20px 20px;background:linear-gradient(135deg,#F2E4CC 0%,#FDF6EC 60%);}
.hero h1{font-family:'Prata',serif;font-size:30px;font-weight:800;line-height:1.2;margin-bottom:8px;}
.hero h1 em{color:#C4622D;font-style:italic;}
.hero p{font-size:14px;color:#8A7968;line-height:1.6;margin-bottom:16px;}
.btn-hero{display:inline-flex;align-items:center;gap:8px;background:#C4622D;color:white;border:none;padding:12px 22px;border-radius:28px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:background 0.2s;}
.btn-hero:hover{background:#9E4A1E;}
.sec-head{padding:20px 20px 12px;display:flex;align-items:baseline;justify-content:space-between;}
.sec-head h2{font-family:'Prata',serif;font-size:18px;font-weight:700;}
.filter-pills{display:flex;gap:8px;padding:0 20px 14px;overflow-x:auto;scrollbar-width:none;}
.pill{flex-shrink:0;padding:8px 16px;border-radius:24px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;background:white;color:#8A7968;border:1.5px solid #F2E4CC;transition:all 0.2s;}
.pill.active{background:#C4622D;color:white;border-color:#C4622D;}
.card{margin:0 20px 16px;border-radius:20px;overflow:hidden;background:white;box-shadow:0 2px 16px rgba(0,0,0,0.07);cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;display:flex;flex-direction:column;}
.card:hover{transform:translateY(-3px);box-shadow:0 6px 24px rgba(0,0,0,0.11);}
.card-img{position:relative;height:150px;overflow:hidden;}
.card-img img{width:100%;height:100%;object-fit:cover;object-position:center 25%;transition:transform 0.4s;}
.card:hover .card-img img{transform:scale(1.03);}
.card-overlay{position:absolute;bottom:0;left:0;right:0;padding:20px 16px 14px;background:linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 100%);color:white;}
.card-overlay h3{font-family:'Prata',serif;font-size:22px;font-weight:600;margin-bottom:2px;}
.card-overlay .loc{font-size:12px;opacity:0.85;}
.badge-verified{position:absolute;top:12px;right:12px;background:#7A9E7E;color:white;font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;}
.role-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;}
.role-badge.owner{background:#EAF2FF;color:#2563EB;}
.role-badge.buddy{background:#FEF3EC;color:#C4622D;}
.card-body{padding:14px 16px 16px;position:relative;flex:1;display:flex;flex-direction:column;}
.card-tagline{font-size:14px;color:#8A7968;font-style:italic;}
.snap-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
.snap{font-size:12px;font-weight:500;padding:4px 10px;border-radius:10px;}
.snap.owner{background:#EAF2FF;color:#2563EB;}
.snap.buddy{background:#FEF3EC;color:#C4622D;}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
.tag{background:#F2E4CC;color:#2C2C2C;font-size:11px;font-weight:500;padding:4px 10px;border-radius:12px;}
.tag.sage{background:#e8f0e9;color:#7A9E7E;}
.lock-bar{display:flex;justify-content:center;margin-top:auto;padding-top:14px;}
.btn-lock{background:#C4622D;color:white;border:none;padding:10px 22px;border-radius:24px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;}
.modal-bg{position:fixed;inset:0;background:rgba(44,44,44,0.55);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:#FDF6EC;border-radius:28px 28px 0 0;padding:28px 24px 36px;width:100%;max-width:430px;max-height:85vh;overflow-y:auto;animation:slideUp 0.3s cubic-bezier(0.34,1.2,0.64,1);}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal-handle{width:40px;height:4px;background:#F2E4CC;border-radius:2px;margin:0 auto 22px;}
.modal h2{font-family:'Prata',serif;font-size:26px;font-weight:700;margin-bottom:6px;}
.modal .sub{font-size:14px;color:#8A7968;margin-bottom:24px;}
.field{margin-bottom:16px;}
.field label{display:block;font-size:12px;font-weight:500;color:#8A7968;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;}
.field input{width:100%;padding:13px 16px;border:1.5px solid #F2E4CC;border-radius:14px;background:white;font-family:'DM Sans',sans-serif;font-size:15px;color:#2C2C2C;outline:none;transition:border-color 0.2s;}
.field input:focus{border-color:#C4622D;}
.btn-main{width:100%;padding:15px;background:#C4622D;color:white;border:none;border-radius:16px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;margin-top:8px;transition:background 0.2s;}
.btn-main:hover{background:#9E4A1E;}
.btn-ghost{width:100%;padding:15px;background:none;color:#C4622D;border:1.5px solid #F4C9A8;border-radius:16px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;margin-top:10px;}
.modal-toggle{text-align:center;margin-top:16px;font-size:13px;color:#8A7968;}
.modal-toggle button{background:none;border:none;color:#C4622D;font-weight:500;cursor:pointer;font-size:13px;}
.role-cards{display:flex;gap:12px;margin-bottom:20px;}
.role-card{flex:1;border:2px solid #F2E4CC;border-radius:18px;padding:16px 12px;text-align:center;cursor:pointer;background:white;transition:all 0.2s;position:relative;}
.role-card.sel{border-color:#C4622D;background:#FEF3EC;}
.role-card .ri{font-size:28px;margin-bottom:8px;}
.role-card .rt{font-family:'Prata',serif;font-size:15px;font-weight:600;margin-bottom:4px;}
.role-card .rd{font-size:11px;color:#8A7968;line-height:1.4;}
.role-card .rck{position:absolute;top:10px;right:10px;width:20px;height:20px;border-radius:50%;background:#C4622D;color:white;font-size:11px;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;}
.role-card.sel .rck{opacity:1;}
.prof-wrap{padding-bottom:60px;}
.prof-hero{position:relative;height:340px;overflow:hidden;background:#F2E4CC;}
.prof-hero img{width:100%;height:100%;object-fit:contain;}
.prof-hero-over{position:absolute;bottom:0;left:0;right:0;padding:28px 20px 20px;background:linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 100%);color:white;}
.prof-hero-over h2{font-family:'Prata',serif;font-size:30px;font-weight:700;}
.prof-hero-over .subloc{font-size:13px;opacity:0.85;margin-top:2px;}
.back-btn{position:absolute;top:16px;left:16px;background:rgba(255,255,255,0.85);border:none;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:5;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.12);}
.stat-row{display:flex;gap:10px;padding:16px 20px;overflow-x:auto;scrollbar-width:none;}
.stat{flex-shrink:0;background:white;border:1px solid #F2E4CC;border-radius:14px;padding:10px 14px;text-align:center;min-width:80px;}
.stat .sl{font-size:10px;color:#8A7968;text-transform:uppercase;letter-spacing:0.4px;}
.stat .sv{font-size:13px;font-weight:500;color:#2C2C2C;margin-top:2px;}
.prof-sec{padding:16px 20px 0;}
.prof-sec h4{font-family:'Prata',serif;font-size:16px;color:#C4622D;margin-bottom:10px;}
.prof-sec p{font-size:14px;line-height:1.7;}
.action-bar{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);width:calc(100% - 40px);max-width:390px;display:flex;gap:12px;z-index:40;}
.action-bar button{flex:1;padding:15px;border-radius:16px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;border:none;}
.btn-like{background:#C4622D;color:white;}
.btn-msg-out{background:white;color:#C4622D;border:1.5px solid #F4C9A8!important;}
.matches-list{padding:0 20px 40px;}
.match-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #F2E4CC;cursor:pointer;}
.match-row:last-child{border-bottom:none;}
.match-av{position:relative;}
.match-av img{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid #F4C9A8;}
.online-dot{position:absolute;bottom:1px;right:1px;width:12px;height:12px;background:#7A9E7E;border-radius:50%;border:2px solid white;}
.match-info{flex:1;}
.match-name{font-weight:500;font-size:15px;margin-bottom:3px;}
.match-prev{font-size:13px;color:#8A7968;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;}
.match-time{font-size:11px;color:#8A7968;}
.chat-wrap{display:flex;flex-direction:column;min-height:100vh;}
.chat-head{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid #F2E4CC;background:#FDF6EC;}
.chat-head img{width:40px;height:40px;border-radius:50%;object-fit:cover;}
.chat-name{font-weight:500;font-size:15px;}
.chat-status{font-size:12px;color:#7A9E7E;}
.chat-back{background:none;border:none;font-size:20px;cursor:pointer;color:#8A7968;}
.chat-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}
.bubble{max-width:75%;padding:11px 16px;border-radius:20px;font-size:14px;line-height:1.5;}
.bubble.me{background:#C4622D;color:white;border-bottom-right-radius:6px;align-self:flex-end;}
.bubble.them{background:white;color:#2C2C2C;border-bottom-left-radius:6px;align-self:flex-start;box-shadow:0 1px 4px rgba(0,0,0,0.06);}
.chat-input{display:flex;align-items:center;gap:10px;padding:12px 16px;background:white;border-top:1px solid #F2E4CC;position:sticky;bottom:0;}
.chat-input input{flex:1;padding:11px 16px;border:1.5px solid #F2E4CC;border-radius:24px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;background:#FDF6EC;}
.chat-input input:focus{border-color:#C4622D;}
.send-btn{background:#C4622D;color:white;border:none;width:42px;height:42px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;}
.empty{text-align:center;padding:60px 30px;}
.empty .ei{font-size:48px;margin-bottom:16px;}
.empty h3{font-family:'Prata',serif;font-size:20px;font-weight:700;margin-bottom:8px;}
.empty p{font-size:14px;color:#8A7968;line-height:1.6;}
.step-bar{display:flex;gap:6px;justify-content:center;margin-bottom:24px;}
.step-seg{height:4px;border-radius:2px;transition:all 0.3s;}
.ms{display:flex;flex-wrap:wrap;gap:8px;}
.ms button{padding:8px 14px;border-radius:20px;border:1.5px solid #F2E4CC;background:white;color:#2C2C2C;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.15s;}
.ms button.on{border-color:#C4622D;background:#FEF3EC;color:#C4622D;font-weight:600;}
.photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.photo-cell{position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;}
.photo-cell img{width:100%;height:100%;object-fit:cover;}
.photo-del{position:absolute;top:5px;right:5px;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,0.55);color:white;border:none;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;}
.photo-add{aspect-ratio:1;border-radius:12px;border:2px dashed #F2E4CC;background:white;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;gap:4px;}
.avatar-ring{width:80px;height:80px;border-radius:50%;background:#F2E4CC;border:2.5px dashed #C4622D;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.avatar-ring img{width:100%;height:100%;object-fit:cover;}
.av-plus{position:absolute;bottom:-2px;right:-2px;width:26px;height:26px;border-radius:50%;background:#C4622D;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,0.2);}
.review-wrap{min-height:100vh;background:#FDF6EC;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 30px;text-align:center;}
.review-box{background:white;border-radius:20px;padding:20px 24px;width:100%;margin-bottom:28px;box-shadow:0 2px 16px rgba(0,0,0,0.07);}
.review-step{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;}
.review-num{width:22px;height:22px;border-radius:50%;background:#F2E4CC;color:#C4622D;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
@media(min-width:768px){
  .wrap{max-width:100%;display:flex;flex-direction:column;min-height:100vh;}
  .nav{max-width:100%;padding:0 32px;height:64px;}
  .main-content{overflow-y:auto;padding-bottom:40px;}
  .profile-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;padding:0 24px 24px;max-width:900px;margin:0 auto;}
  .card{margin:0;}
  .hero{padding:40px 32px 32px;max-width:900px;margin:0 auto;}
  .hero h1{font-size:40px;}
  .sec-head{padding:24px 32px 12px;max-width:900px;margin:0 auto;width:100%;box-sizing:border-box;}
  .filter-pills{padding:0 32px 16px;max-width:900px;margin:0 auto;}
  .matches-list{padding:0 32px 40px;max-width:900px;margin:0 auto;}
}
@media(min-width:1200px){
  .profile-grid{grid-template-columns:repeat(3,1fr);max-width:1100px;}
  .hero,.sec-head,.filter-pills,.matches-list{max-width:1100px;}
}
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}
function formatBeschikbaarheid(profile) {
  if (profile.flexibeleData) return "Flexibel";
  if (profile.beschikbaarVan && profile.beschikbaarTot) {
    return `${formatDate(profile.beschikbaarVan)} – ${formatDate(profile.beschikbaarTot)}`;
  }
  return "";
}

function dataUrlToFile(dataUrl, filename) {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

// ── ICONS (simpel & neutraal, geen emoji) ───────────────────────────────────
function HouseIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: 4 }}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}
function PeopleIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: 4 }}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M16 14.5c2.6 0.4 4 1.9 4 4.5" />
    </svg>
  );
}
function GlobeIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-2px", marginRight: 4 }}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 4 5.7 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.7-4-9s1.5-6.5 4-9z" />
    </svg>
  );
}

// ── AUTH MODAL ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, onLogin, onSignupSuccess, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email || !password) return;
    if (mode === "signup" && !role) return;
    setLoading(true); setError("");
    try {
      if (mode === "signup") {
        await signUp({ email, password, name: name || email.split("@")[0], role });
        onSignupSuccess(email);
        return;
      } else {
        const user = await signIn({ email, password });
        let profile = null;
        try { profile = await getProfile(user.id); } catch(e) {}
        onLogin({
          id: user.id,
          name: profile?.name || name || email.split("@")[0],
          email,
          role: profile?.role || "buddy",
          avatar: profile?.avatar_url || "https://i.pravatar.cc/80?img=12",
          isNew: !profile,
          ...(profile || {}),
        });
      }
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <h2>{mode === "login" ? "Welkom terug" : "Word lid van BnbBuddy"}</h2>
        <p className="sub">{mode === "login" ? "Log in om volledige profielen te zien en te chatten" : "Vertel ons wie je bent om te beginnen"}</p>
        {mode === "signup" && (
          <>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#8A7968", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>Ik ben een…</div>
            <div className="role-cards">
              <div className={`role-card ${role === "owner" ? "sel" : ""}`} onClick={() => setRole("owner")}>
                <div className="rck">✓</div>
                <div className="ri">🏡</div>
                <div className="rt">BnB Eigenaar</div>
                <div className="rd">Ik verhuur en wil verbinding maken met de juiste gasten</div>
              </div>
              <div className={`role-card ${role === "buddy" ? "sel" : ""}`} onClick={() => setRole("buddy")}>
                <div className="rck">✓</div>
                <div className="ri">🎒</div>
                <div className="rt">Buddy</div>
                <div className="rd">I'm a traveller looking for a stay or travel companion</div>
              </div>
            </div>
            {!role && <div style={{ fontSize: 12, color: "#C4622D", marginBottom: 8 }}>Selecteer een rol om door te gaan</div>}
            <div className="field"><label>Jouw naam</label><input placeholder="Voornaam" value={name} onChange={e => setName(e.target.value)} /></div>
          </>
        )}
        <div className="field"><label>Email</label><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="field">
          <label>Wachtwoord</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ paddingRight: 48 }}
            />
            <button
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute", right: 14, top: "50%",
                transform: "translateY(-50%)",
                background: "none", border: "none",
                cursor: "pointer", fontSize: 18, color: "#8A7968",
              }}
            >
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
        </div>
        {error && <div style={{ fontSize: 13, color: "#C4622D", marginBottom: 8, padding: "8px 12px", background: "#FEF3EC", borderRadius: 8 }}>{error}</div>}
        <button className="btn-main" onClick={submit} style={{ opacity: (mode === "signup" && !role) || loading ? 0.5 : 1 }}>
          {loading ? "Even geduld…" : mode === "login" ? "Inloggen" : "Account aanmaken"} →
        </button>
        <div className="modal-toggle">
          {mode === "login" ? "Nieuw hier? " : "Al een account? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setRole(null); }}>
            {mode === "login" ? "Account aanmaken" : "Inloggen"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PROFILE CARD ──────────────────────────────────────────────────────────────
function ProfileCard({ profile, isLoggedIn, onView, onLogin }) {
  const isOwner = profile.role === "owner";
  return (
    <div className="card" onClick={() => onView(profile)}>
      <div className="card-img">
        <img src={profile.avatar} alt={profile.name} style={{ objectPosition: `${profile.focusX ?? 50}% ${profile.focusY ?? 25}%` }} />
        {profile.verified && <span className="badge-verified">✓ Verified</span>}
      </div>
      <div className="card-body">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <div>
            <h3 style={{ fontFamily: "'Prata',serif", fontSize: 18, fontWeight: 600, color: "#2C2C2C" }}>
              {profile.name}{!isOwner ? `, ${profile.age}` : ""}
            </h3>
            <div style={{ fontSize: 12, color: "#8A7968" }}>{profile.country} · {profile.city}</div>
          </div>
          <span className={`role-badge ${profile.role}`}>{isOwner ? <><HouseIcon /> Eigenaar</> : <><PeopleIcon /> Buddy</>}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
          <div className="card-tagline">"{profile.tagline}"</div>
        </div>
        {isOwner ? (
          <>
            <div className="snap-row">
              <span className="snap owner">🏠 {profile.propertyType}</span>
              <span className="snap owner">🛏 {profile.rooms} room{profile.rooms > 1 ? "s" : ""}</span>
              <span className="snap owner">💶 {profile.pricePerNight}</span>
              {formatBeschikbaarheid(profile) && <span className="snap owner">📅 {formatBeschikbaarheid(profile)}</span>}
            </div>
            <div className="tags">{(profile.amenities || []).slice(0, 3).map(a => <span className="tag" key={a}>{a}</span>)}</div>
          </>
        ) : (
          <>
            <div className="snap-row">
              {profile.bestemmingen && <span className="snap buddy">✈ {profile.bestemmingen}</span>}
              {formatBeschikbaarheid(profile) && <span className="snap buddy">📅 {formatBeschikbaarheid(profile)}</span>}
            </div>
            {(profile.maanden?.length > 0 || profile.aantalPersonen) && (
              <div className="snap-row" style={{ marginTop: 4 }}>
                {profile.maanden?.length > 0 && <span className="snap buddy">📅 {profile.maanden.slice(0, 2).join(", ")}{profile.maanden.length > 2 ? "…" : ""}</span>}
                {profile.aantalPersonen && <span className="snap buddy">👥 {profile.aantalPersonen}</span>}
              </div>
            )}
            <div className="tags">{(profile.interests || []).slice(0, 3).map(t => <span className="tag" key={t}>{t}</span>)}</div>
          </>
        )}
        {!isLoggedIn && (
          <div className="lock-bar">
            <button className="btn-lock" onClick={e => { e.stopPropagation(); onLogin(); }}>🔒 Login voor profiel · {isOwner ? "Eigenaar" : "Buddy"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FULL PROFILE ──────────────────────────────────────────────────────────────
function FullProfile({ profile, onBack, onChat, isLoggedIn, onLogin, isOwnProfile, onEdit }) {
  const isOwner = profile.role === "owner";
  return (
    <div className="prof-wrap">
      <div className="prof-hero">
        <button className="back-btn" onClick={onBack}>←</button>
        <img src={profile.avatar} alt={profile.name} />
        <div className="prof-hero-over">
          <h2>{profile.name}{!isOwner ? `, ${profile.age}` : ""}</h2>
          <div className="subloc">{profile.country} · {profile.city}</div>
          <span className={`role-badge ${profile.role}`} style={{ marginTop: 8, display: "inline-flex" }}>
            {isOwner ? "🏡 BnB Eigenaar" : "🎒 Buddy"}
          </span>
        </div>
        {profile.verified && <span className="badge-verified" style={{ position: "absolute", top: 14, right: 14 }}>✓ Verified</span>}
      </div>

      <div className="stat-row">
        {isOwner ? (
          <>
            <div className="stat"><div className="sl">Pand</div><div className="sv">{profile.propertyType}</div></div>
            <div className="stat"><div className="sl">Kamers</div><div className="sv">{profile.rooms}</div></div>
            <div className="stat"><div className="sl">Prijs/nacht</div><div className="sv">{profile.pricePerNight}</div></div>
            <div className="stat"><div className="sl">Beschikbaar</div><div className="sv">{formatBeschikbaarheid(profile) || "—"}</div></div>
          </>
        ) : (
          <>
            <div className="stat"><div className="sl">Bestemming</div><div className="sv">{profile.bestemmingen || "—"}</div></div>
            <div className="stat"><div className="sl">Beschikbaar</div><div className="sv">{formatBeschikbaarheid(profile) || "—"}</div></div>
            <div className="stat"><div className="sl">Maanden</div><div className="sv">{profile.maanden?.length > 0 ? profile.maanden.join(", ") : "—"}</div></div>
            <div className="stat"><div className="sl">Personen</div><div className="sv">{profile.aantalPersonen || "—"}</div></div>
          </>
        )}
      </div>

      <div style={{ padding: "0 20px", display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
        {(profile.languages || []).map(l => <span className="tag sage" key={l}>🌐 {l}</span>)}
      </div>

      {isOwner && (
        <div className="prof-sec">
          <h4>🏡 {profile.propertyName}</h4>
          <div className="tags">{(profile.amenities || []).map(a => <span className="tag" key={a}>{a}</span>)}</div>
        </div>
      )}

      <div className="prof-sec" style={{ marginTop: 16 }}>
        <h4>Over {profile.name}</h4>
        {isLoggedIn ? (
          <p>{profile.bio}</p>
        ) : (
          <div style={{ position: "relative" }}>
            <p style={{ lineHeight: 1.7, fontSize: 14 }}>{(profile.bio || "").split(" ").slice(0, 28).join(" ")}…</p>
            <div style={{ position: "relative", marginTop: 4 }}>
              <p style={{ lineHeight: 1.7, fontSize: 14, filter: "blur(3.5px)", userSelect: "none", maskImage: "linear-gradient(to bottom,black 0%,transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom,black 0%,transparent 100%)" }}>
                {(profile.bio || "").split(" ").slice(28).join(" ")}
              </p>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", paddingBottom: 4 }}>
                <button className="btn-lock" onClick={onLogin} style={{ fontSize: 13, padding: "9px 20px" }}>🔒 Login voor meer</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="prof-sec" style={{ marginTop: 16 }}>
        <h4>Interesses</h4>
        <div className="tags">{(profile.interests || []).map(t => <span className="tag" key={t}>{t}</span>)}</div>
      </div>

      <div className="prof-sec" style={{ marginTop: 16 }}>
        <h4>{isOwner ? "Foto's van het pand" : "Reisfoto's"}</h4>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {profile.photos.map((p, i) => (
            <img key={i} src={p} alt="photo" style={{ width: "calc(50% - 5px)", aspectRatio: "1", objectFit: "cover", borderRadius: 14 }} />
          ))}
        </div>
      </div>

      <div className="action-bar">
        <button className="btn-msg-out" onClick={onBack}>← Terug</button>
        {isOwnProfile
          ? <button className="btn-like" onClick={onEdit}>✏️ Profiel bewerken</button>
          : isLoggedIn
            ? <button className="btn-like" onClick={() => onChat(profile)}>💬 Bericht</button>
            : <button className="btn-like" onClick={onLogin}>🔒 Login om te chatten</button>
        }
      </div>
    </div>
  );
}

// ── CHAT ──────────────────────────────────────────────────────────────────────
function ChatView({ profile, messages, onBack, onSend }) {
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const send = () => { if (!input.trim()) return; onSend(profile.id, input.trim()); setInput(""); };
  return (
    <div className="chat-wrap">
      <div className="chat-head">
        <button className="chat-back" onClick={onBack}>←</button>
        <img src={profile.avatar} alt={profile.name} />
        <div><div className="chat-name">{profile.name}</div><div className="chat-status">● Online</div></div>
      </div>
      <div className="chat-msgs">
        {(messages || []).map((m, i) => <div key={i} className={`bubble ${m.from === "me" ? "me" : "them"}`}>{m.text}</div>)}
        <div ref={endRef} />
      </div>
      <div className="chat-input">
        <input placeholder={`Bericht aan ${profile.name}…`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
        <button className="send-btn" onClick={send}>➤</button>
      </div>
    </div>
  );
}

// ── MATCHES ───────────────────────────────────────────────────────────────────
function MatchesTab({ matches, onOpenChat }) {
  if (!matches.length) return (
    <div className="empty"><div className="ei">💬</div><h3>Nog geen berichten</h3><p>Bekijk profielen en start een gesprek.</p></div>
  );
  return (
    <div className="matches-list">
      {matches.map(p => (
        <div className="match-row" key={p.id} onClick={() => onOpenChat(p)}>
          <div className="match-av"><img src={p.avatar} alt={p.name} /><div className="online-dot" /></div>
          <div className="match-info">
            <div className="match-name">{p.name}</div>
            <div className="match-prev">{p.role === "owner" ? `🏡 ${p.propertyName}` : `✈ ${p.bestemmingen || ""}`}</div>
          </div>
          <div className="match-time">now</div>
        </div>
      ))}
    </div>
  );
}

// ── MULTI SELECT ──────────────────────────────────────────────────────────────
function MultiSelect({ options, selected, onToggle, max }) {
  const [open, setOpen] = useState(false);
  const summary = selected.length === 0
    ? "Selecteer…"
    : selected.length <= 2
      ? selected.join(", ")
      : `${selected.length} geselecteerd`;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 16px", border: "1.5px solid #F2E4CC", borderRadius: 14, background: "white",
          fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: selected.length ? "#2C2C2C" : "#8A7968", cursor: "pointer",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{summary}</span>
        <span style={{ marginLeft: 8, color: "#C4622D", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </button>
      {open && (
        <div className="ms" style={{ marginTop: 10 }}>
          {options.map(o => {
            const on = selected.includes(o);
            const disabled = max && !on && selected.length >= max;
            return <button key={o} className={on ? "on" : ""} onClick={() => !disabled && onToggle(o)} style={{ opacity: disabled ? 0.4 : 1 }}>{o}</button>;
          })}
        </div>
      )}
    </div>
  );
}

// ── PHOTO UPLOAD ──────────────────────────────────────────────────────────────
function PhotoStep({ avatar, photos, isOwner, onAvatar, onPhotos, focusX, focusY, onFocusXChange, onFocusYChange }) {
  const MAX = 6;
  const readFile = f => new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsDataURL(f); });
  const handleAvatar = async e => { const f = e.target.files[0]; if (f) onAvatar(await readFile(f)); };
  const handlePhotos = async e => {
    const files = Array.from(e.target.files).slice(0, MAX - photos.length);
    const results = await Promise.all(files.map(readFile));
    onPhotos([...photos, ...results]);
  };
  return (
    <div>
      <h2 style={{ fontFamily: "'Prata',serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Voeg foto's toe</h2>
      <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Een profielfoto helpt mensen jou te herkennen. {isOwner ? "Pandfoto's" : "Reisfoto's"} laten je opvallen.</p>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#8A7968", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Profielfoto</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <div className="avatar-ring">{avatar ? <img src={avatar} alt="av" /> : <span style={{ fontSize: 28 }}>👤</span>}</div>
            <label className="av-plus">＋<input type="file" accept="image/*" onChange={handleAvatar} style={{ display: "none" }} /></label>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{avatar ? "Ziet er geweldig uit! 🎉" : "Upload een duidelijke foto van jezelf"}</div>
            <div style={{ fontSize: 12, color: "#8A7968" }}>Vierkante foto's werken het beste.</div>
          </div>
        </div>
      </div>
      {avatar && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#8A7968", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Focuspunt op kaartjes</div>
          <p style={{ fontSize: 12, color: "#8A7968", marginBottom: 10 }}>Sleep de schuifregelaars zodat je gezicht goed in beeld blijft op de profielkaart.</p>
          <div style={{ borderRadius: 14, overflow: "hidden", height: 150, marginBottom: 10 }}>
            <img src={avatar} alt="voorbeeld" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${focusX}% ${focusY}%` }} />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={focusY}
            onChange={e => onFocusYChange(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8A7968", marginBottom: 14 }}>
            <span>Boven</span><span>Onder</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={focusX}
            onChange={e => onFocusXChange(Number(e.target.value))}
            style={{ width: "100%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8A7968" }}>
            <span>Links</span><span>Rechts</span>
          </div>
        </div>
      )}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#8A7968", textTransform: "uppercase", letterSpacing: "0.5px" }}>{isOwner ? "Foto's van het pand" : "Reisfoto's"}</div>
          <div style={{ fontSize: 12, color: "#8A7968" }}>{photos.length}/{MAX}</div>
        </div>
        <div className="photo-grid">
          {photos.map((src, i) => (
            <div className="photo-cell" key={i}>
              <img src={src} alt="" />
              <button className="photo-del" onClick={() => onPhotos(photos.filter((_, j) => j !== i))}>✕</button>
            </div>
          ))}
          {photos.length < MAX && (
            <label className="photo-add">
              <span style={{ fontSize: 22, color: "#C4622D" }}>＋</span>
              <span style={{ fontSize: 11, color: "#8A7968" }}>Foto toevoegen</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: "none" }} />
            </label>
          )}
        </div>
        {!photos.length && <p style={{ fontSize: 12, color: "#8A7968", marginTop: 10, fontStyle: "italic" }}>Foto's are optional but profiles with photos get 3× more matches!</p>}
      </div>
    </div>
  );
}

// ── CREATE PROFILE ────────────────────────────────────────────────────────────
function CreateProfile({ user, onDone, onClose }) {
  const isOwner = user.role === "owner";
  const STEPS = 6;
  const [step, setStep] = useState(1);
  const titles = isOwner
    ? ["Basisgegevens", "Jouw verhaal", "Jouw pand", "Voorzieningen & prijs", "Interesses", "Foto's"]
    : ["Basisgegevens", "Jouw verhaal", "Travel plans", "Preferences", "Interesses", "Foto's"];
  const [form, setForm] = useState({
    tagline: user.tagline || "", bio: user.bio || "", city: user.city || "", country: user.country || "", age: user.age ? String(user.age) : "",
    languages: user.languages || [], interests: user.interests || [],
    vaardigheden: user.vaardigheden || [], bestemmingen: user.bestemmingen ? [...user.bestemmingen.split(",").map(s => s.trim()), "", "", ""].slice(0, 3) : ["", "", ""], tripDuration: user.trip_duration || "", maanden: user.maanden || [], aantalPersonen: user.aantal_personen || "", overigeTaal: user.overige_taal || "", overigeInteresse: user.overige_interesse || "",
    beschikbaarVan: user.beschikbaar_van || "", beschikbaarTot: user.beschikbaar_tot || "", flexibeleData: user.flexibele_data || false,
    propertyName: user.property_name || "", propertyType: user.property_type || "", rooms: user.rooms ? String(user.rooms) : "", priceVan: user.price_from ? String(user.price_from) : "", priceTot: user.price_to ? String(user.price_to) : "", amenities: user.amenities || [], houseRules: user.house_rules || "",
    avatar: user.avatar_url || user.avatar || null,
    photos: (user.photos || []).filter(p => p.type === "gallery").map(p => p.url),
    focusY: user.focus_y ?? 25,
    focusX: user.focus_x ?? 50,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const tog = (k, v) => setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }));
  const ok = () => {
    if (step === 1) return form.city && form.country && (isOwner || form.age);
    if (step === 2) return form.tagline && form.bio;
    if (step === 3) return isOwner ? (form.propertyName && form.propertyType && form.rooms) : form.vaardigheden.length > 0;
    if (step === 4) {
      const datesOk = form.flexibeleData || (form.beschikbaarVan && form.beschikbaarTot);
      return isOwner ? (form.amenities.length > 0 && datesOk) : datesOk;
    }
    if (step === 5) return form.languages.length > 0 && form.interests.length > 0;
    return true;
  };
  const sb = (val, cur) => ({ padding: "8px 14px", borderRadius: 20, border: "1.5px solid", borderColor: cur === val ? "#C4622D" : "#F2E4CC", background: cur === val ? "#FEF3EC" : "white", color: cur === val ? "#C4622D" : "#2C2C2C", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: cur === val ? 600 : 400 });

  return (
    <div style={{ minHeight: "100vh", background: "#FDF6EC", paddingBottom: 40 }}>
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #F2E4CC", display: "flex", alignItems: "center", gap: 12 }}>
        {step > 1 && <button onClick={() => setStep(s => s - 1)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8A7968" }}>←</button>}
        <div>
          <div style={{ fontFamily: "'Prata',serif", fontSize: 18 }}>{titles[step - 1]}</div>
          <div style={{ fontSize: 12, color: "#8A7968" }}>Stap {step} van {STEPS}</div>
        </div>
        <span className={`role-badge ${user.role}`} style={{ marginLeft: "auto" }}>{isOwner ? "🏡 Eigenaar" : "🎒 Buddy"}</span>
        {onClose && <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8A7968", marginLeft: 8 }}>✕</button>}
      </div>
      <div style={{ padding: "24px 20px" }}>
        <div className="step-bar">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className="step-seg" style={{ flex: i === step - 1 ? 2 : 1, background: i < step ? "#C4622D" : "#F2E4CC" }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Prata',serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Hoi {user.name}! 👋</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Laten we jouw {isOwner ? "host" : "Buddy"} profiel aanmaken.</p>
            {!isOwner && <div className="field"><label>Jouw leeftijd</label><input type="number" placeholder="bijv. 28" value={form.age} onChange={e => set("age", e.target.value)} /></div>}
            <div className="field"><label>Stad</label><input placeholder="bijv. Amsterdam" value={form.city} onChange={e => set("city", e.target.value)} /></div>
            <div className="field"><label>Land</label><input placeholder="bijv. Nederland" value={form.country} onChange={e => set("country", e.target.value)} /></div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Prata',serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Vertel je verhaal</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Dit is wat anderen op jouw profiel zien.</p>
            <div className="field">
              <label>Pakkende zin over jou</label>
              <input placeholder={isOwner ? "bijv. Gezellige kamers, mooie omgeving" : "bijv. Rustig reizen & sterke koffie"} value={form.tagline} onChange={e => set("tagline", e.target.value)} maxLength={60} />
              <div style={{ fontSize: 11, color: "#8A7968", marginTop: 4 }}>{form.tagline.length}/60</div>
            </div>
            <div className="field">
              <label>Over jou</label>
              <textarea placeholder={isOwner ? "Vertel gasten over je pand…" : "Wat voor Buddy ben jij?…"} value={form.bio} onChange={e => set("bio", e.target.value)} rows={5} maxLength={400}
                style={{ width: "100%", padding: "13px 16px", border: "1.5px solid #F2E4CC", borderRadius: 14, background: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none", resize: "none", lineHeight: 1.6 }} />
              <div style={{ fontSize: 11, color: "#8A7968", marginTop: 4 }}>{form.bio.length}/400</div>
            </div>
          </div>
        )}

        {step === 3 && isOwner && (
          <div>
            <h2 style={{ fontFamily: "'Prata',serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Jouw pand</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Vertel gasten wat je aanbiedt.</p>
            <div className="field"><label>Naam van het pand</label><input placeholder="bijv. Casa Sabor" value={form.propertyName} onChange={e => set("propertyName", e.target.value)} /></div>
            <div className="field">
              <label>Type pand</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PROPERTY_TYPES.map(t => <button key={t} onClick={() => set("propertyType", t)} style={sb(t, form.propertyType)}>{t}</button>)}
              </div>
            </div>
            <div className="field"><label>Number of rooms</label><input type="number" min="1" placeholder="bijv. 3" value={form.rooms} onChange={e => set("rooms", e.target.value)} /></div>
            <div className="field">
              <label>Prijs per nacht (€) — van / tot</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="number" placeholder="Van" value={form.priceVan} onChange={e => set("priceVan", e.target.value)} style={{ flex: 1 }} />
                <span style={{ color: "#8A7968" }}>–</span>
                <input type="number" placeholder="Tot" value={form.priceTot} onChange={e => set("priceTot", e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
            <div className="field"><label>Huisregels (optioneel)</label><input placeholder="bijv. Niet roken, inchecken na 15:00" value={form.houseRules} onChange={e => set("houseRules", e.target.value)} /></div>
          </div>
        )}

        {step === 3 && !isOwner && (
          <div>
            <h2 style={{ fontFamily: "'Prata',serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Bestemming</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Welke bestemmingen hebben jouw voorkeur?</p>
            {[0, 1, 2].map(i => (
              <div className="field" key={i}>
                <label>Bestemming {i + 1}{i > 0 ? " (optioneel)" : ""}</label>
                <input
                  placeholder="bijv. Lissabon, Portugal"
                  value={form.bestemmingen[i] || ""}
                  onChange={e => {
                    const arr = [...form.bestemmingen];
                    arr[i] = e.target.value;
                    set("bestemmingen", arr);
                  }}
                />
              </div>
            ))}
            <div className="field">
              <label>Vaardigheden (wat breng jij mee)</label>
              <MultiSelect options={VAARDIGHEDEN} selected={form.vaardigheden} onToggle={v => tog("vaardigheden", v)} />
            </div>
          </div>
        )}

        {step === 4 && isOwner && (
          <div>
            <h2 style={{ fontFamily: "'Prata',serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Voorzieningen & beschikbaarheid</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Wat bied je gasten aan?</p>
            <MultiSelect options={AMENITIES_LIST} selected={form.amenities} onToggle={v => tog("amenities", v)} />

            <div className="field" style={{ marginTop: 24 }}>
              <label>Beschikbaar van</label>
              <input type="date" value={form.beschikbaarVan} onChange={e => set("beschikbaarVan", e.target.value)} disabled={form.flexibeleData} style={{ opacity: form.flexibeleData ? 0.5 : 1 }} />
            </div>
            <div className="field">
              <label>Beschikbaar tot</label>
              <input type="date" value={form.beschikbaarTot} onChange={e => set("beschikbaarTot", e.target.value)} disabled={form.flexibeleData} style={{ opacity: form.flexibeleData ? 0.5 : 1 }} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#2C2C2C", cursor: "pointer", marginTop: 4 }}>
              <input type="checkbox" checked={form.flexibeleData} onChange={e => set("flexibeleData", e.target.checked)} style={{ width: "auto" }} />
              Mijn beschikbaarheid is flexibel
            </label>
          </div>
        )}

        {step === 4 && !isOwner && (
          <div>
            <h2 style={{ fontFamily: "'Prata',serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Beschikbaarheid</h2>
            <div className="field">
              <label>Beschikbaar van</label>
              <input type="date" value={form.beschikbaarVan} onChange={e => set("beschikbaarVan", e.target.value)} disabled={form.flexibeleData} style={{ opacity: form.flexibeleData ? 0.5 : 1 }} />
            </div>
            <div className="field">
              <label>Beschikbaar tot</label>
              <input type="date" value={form.beschikbaarTot} onChange={e => set("beschikbaarTot", e.target.value)} disabled={form.flexibeleData} style={{ opacity: form.flexibeleData ? 0.5 : 1 }} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#2C2C2C", cursor: "pointer", marginTop: 4, marginBottom: 8 }}>
              <input type="checkbox" checked={form.flexibeleData} onChange={e => set("flexibeleData", e.target.checked)} style={{ width: "auto" }} />
              Mijn data zijn flexibel
            </label>
            <div className="field" style={{ marginTop: 20 }}>
              <label>Maanden</label>
              <MultiSelect options={MAANDEN} selected={form.maanden} onToggle={v => tog("maanden", v)} />
            </div>
            <div className="field" style={{ marginTop: 20 }}>
              <label>Aantal personen</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {AANTAL_PERSONEN.map(a => <button key={a} onClick={() => set("aantalPersonen", a)} style={sb(a, form.aantalPersonen)}>{a}</button>)}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 style={{ fontFamily: "'Prata',serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Bijna klaar!</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Voeg je talen en interesses toe.</p>
            <div className="field">
              <label>Talen die je spreekt</label>
              <MultiSelect options={LANGUAGES_LIST} selected={form.languages} onToggle={v => tog("languages", v)} />
              <input placeholder="Overige taal..." value={form.overigeTaal} onChange={e => set("overigeTaal", e.target.value)}
                style={{ marginTop: 10, width: "100%", padding: "10px 16px", border: "1.5px solid #F2E4CC", borderRadius: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }} />
            </div>
            <div className="field" style={{ marginTop: 20 }}>
              <label>Interesses (kies max. 6)</label>
              <MultiSelect options={INTERESTS_LIST} selected={form.interests} onToggle={v => tog("interests", v)} max={6} />
              <input placeholder="Overige interesse..." value={form.overigeInteresse} onChange={e => set("overigeInteresse", e.target.value)}
                style={{ marginTop: 10, width: "100%", padding: "10px 16px", border: "1.5px solid #F2E4CC", borderRadius: 14, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none" }} />
            </div>
          </div>
        )}

        {step === 6 && (
          <PhotoStep avatar={form.avatar} photos={form.photos} isOwner={isOwner}
            onAvatar={v => set("avatar", v)} onPhotos={v => set("photos", v)}
            focusY={form.focusY} onFocusYChange={v => set("focusY", v)}
            focusX={form.focusX} onFocusXChange={v => set("focusX", v)} />
        )}

        <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
          {step > 1 && <button className="btn-ghost" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>← Terug</button>}
          {step < STEPS
            ? <button className="btn-main" onClick={() => ok() && setStep(s => s + 1)} style={{ flex: 2, opacity: ok() ? 1 : 0.45 }}>Verder →</button>
            : <button className="btn-main" onClick={() => onDone(form)} style={{ flex: 2 }}>Profiel indienen 🎉</button>
          }
        </div>
      </div>
    </div>
  );
}

// ── UNDER REVIEW ──────────────────────────────────────────────────────────────
function UnderReview({ user, onBrowse }) {
  return (
    <div className="review-wrap">
      <div style={{ fontSize: 64, marginBottom: 24 }}>🌍</div>
      <h1 style={{ fontFamily: "'Prata',serif", fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Je bent onderweg, {user.name}!</h1>
      <p style={{ fontSize: 15, color: "#8A7968", lineHeight: 1.7, marginBottom: 8 }}>Je profiel is ingediend en wordt momenteel <strong style={{ color: "#C4622D" }}>beoordeeld</strong>.</p>
      <p style={{ fontSize: 14, color: "#8A7968", lineHeight: 1.7, marginBottom: 32 }}>We controleren elk profiel om BnbBuddy veilig en gastvrij te houden. Je ontvangt binnen <strong>24–48 uur</strong>.</p>
      <div className="review-box">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>⏳</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Wat gebeurt er nu</span>
        </div>
        {["Jouw profiel wordt beoordeeld door ons team", "Je ontvangt een e-mail zodra het is goedgekeurd", "Jouw profiel verschijnt in de community", "Begin met verbinden met matches!"].map((s, i) => (
          <div className="review-step" key={i}>
            <div className="review-num">{i + 1}</div>
            <span style={{ fontSize: 13, color: "#8A7968", lineHeight: 1.5 }}>{s}</span>
          </div>
        ))}
      </div>
      <button className="btn-main" onClick={onBrowse} style={{ width: "100%" }}>Bekijk alvast profielen →</button>
    </div>
  );
}


// ── E-MAIL BEVESTIGD ─────────────────────────────────────────────────────────
function EmailBevestigd({ onLogin }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#FDF6EC",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 30px", textAlign: "center"
    }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
      <h1 style={{ fontFamily: "'Prata',serif", fontSize: 28, fontWeight: 700, color: "#2C2C2C", marginBottom: 12 }}>
        E-mail bevestigd!
      </h1>
      <p style={{ fontSize: 16, color: "#8A7968", lineHeight: 1.7, marginBottom: 8, maxWidth: 360 }}>
        Welkom bij BnbBuddy!
      </p>
      <p style={{ fontSize: 15, color: "#8A7968", lineHeight: 1.7, marginBottom: 36, maxWidth: 360 }}>
        Je account is actief. Je kunt nu inloggen en je profiel aanmaken.
      </p>
      <button
        className="btn-main"
        onClick={onLogin}
        style={{ maxWidth: 320, width: "100%" }}
      >
        Inloggen →
      </button>
    </div>
  );
}

// ── CHECK JE E-MAIL ──────────────────────────────────────────────────────────
function CheckEmail({ email, onBackToLogin }) {
  return (
    <div style={{
      minHeight: "100vh", background: "#FDF6EC",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 30px", textAlign: "center"
    }}>
      <div style={{ fontSize: 72, marginBottom: 24 }}>📬</div>
      <h1 style={{ fontFamily: "'Prata',serif", fontSize: 28, fontWeight: 700, color: "#2C2C2C", marginBottom: 12 }}>
        Check je e-mail!
      </h1>
      <p style={{ fontSize: 16, color: "#8A7968", lineHeight: 1.7, marginBottom: 8, maxWidth: 360 }}>
        We hebben een bevestigingslink gestuurd naar <strong style={{ color: "#2C2C2C" }}>{email}</strong>
      </p>
      <p style={{ fontSize: 15, color: "#8A7968", lineHeight: 1.7, marginBottom: 36, maxWidth: 360 }}>
        Klik op de link in de e-mail om je account te activeren. Geen mail ontvangen? Check ook je spam-map.
      </p>
      <button
        className="btn-main"
        onClick={onBackToLogin}
        style={{ maxWidth: 320, width: "100%" }}
      >
        Terug naar inloggen →
      </button>
    </div>
  );
}

// ── ADMIN GATE (wachtwoordscherm) ───────────────────────────────────────────
function AdminGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    if (pw === ADMIN_PASSWORD) { onUnlock(); }
    else setError("Onjuist wachtwoord.");
  };
  return (
    <div style={{
      minHeight: "100vh", background: "#FDF6EC",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 30px", textAlign: "center"
    }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>🔐</div>
      <h1 style={{ fontFamily: "'Prata',serif", fontSize: 24, fontWeight: 700, color: "#2C2C2C", marginBottom: 20 }}>
        Admin-toegang
      </h1>
      <div className="field" style={{ width: "100%", maxWidth: 320 }}>
        <input
          type="password"
          placeholder="Wachtwoord"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{ textAlign: "center" }}
        />
      </div>
      {error && <div style={{ fontSize: 13, color: "#C4622D", marginBottom: 8 }}>{error}</div>}
      <button className="btn-main" onClick={submit} style={{ maxWidth: 320, width: "100%" }}>
        Inloggen →
      </button>
    </div>
  );
}

// ── ADMIN PANEL ──────────────────────────────────────────────────────────────
function toDisplayProfile(p) {
  return {
    ...p,
    avatar: p.avatar_url || "https://i.pravatar.cc/400?img=47",
    photos: (p.photos || []).filter(ph => ph.type === "gallery").map(ph => ph.url),
    tripDuration: p.trip_duration || "",
    beschikbaarVan: p.beschikbaar_van || "",
    beschikbaarTot: p.beschikbaar_tot || "",
    flexibeleData: p.flexibele_data || false,
    aantalPersonen: p.aantal_personen || "",
    pricePerNight: p.price_from && p.price_to ? `€${p.price_from}–€${p.price_to}` : "",
    propertyName: p.property_name || "",
    propertyType: p.property_type || "",
    hostingSince: p.hosting_since || "",
    bio: p.bio || "",
    tagline: p.tagline || "",
    amenities: p.amenities || [],
    interests: p.interests || [],
    languages: p.languages || [],
    bestemmingen: p.bestemmingen || "",
    maanden: p.maanden || [],
    focusY: p.focus_y ?? 25,
    focusX: p.focus_x ?? 50,
  };
}

function AdminPanel({ onLock }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [previewProfile, setPreviewProfile] = useState(null);

  const load = () => {
    setLoading(true);
    getAllProfiles()
      .then(data => setProfiles(data || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try {
      await upsertProfile(id, { status });
      setProfiles(p => p.map(pr => pr.id === id ? { ...pr, status } : pr));
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (p) => {
    const ok = window.confirm(`Profiel van "${p.name || p.email}" definitief verwijderen? Dit kan niet ongedaan worden gemaakt (foto's, berichten en likes worden ook verwijderd).`);
    if (!ok) return;
    try {
      await deleteProfile(p.id);
      setProfiles(prev => prev.filter(pr => pr.id !== p.id));
    } catch (e) { console.error(e); alert("Verwijderen mislukt, zie console voor details."); }
  };

  const filtered = profiles.filter(p => filter === "all" ? true : p.status === filter);

  return (
    <div style={{ minHeight: "100vh", background: "#FDF6EC", padding: "24px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Prata',serif", fontSize: 24 }}>Admin — Profielen</h1>
        <button className="btn-nav" onClick={onLock}>Vergrendelen</button>
      </div>

      <div className="filter-pills" style={{ padding: 0, marginBottom: 16 }}>
        {["pending", "approved", "rejected", "all"].map(f => (
          <button key={f} className={`pill ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "pending" ? "⏳ In behandeling" : f === "approved" ? "✅ Goedgekeurd" : f === "rejected" ? "🚫 Afgekeurd" : "🌍 Alles"}
          </button>
        ))}
        <button className="pill" onClick={load} style={{ marginLeft: "auto" }}>↻ Vernieuwen</button>
      </div>

      {loading ? (
        <p style={{ color: "#8A7968" }}>Laden…</p>
      ) : !filtered.length ? (
        <p style={{ color: "#8A7968" }}>Geen profielen in deze categorie.</p>
      ) : (
        filtered.map(p => (
          <div key={p.id} className="review-box" style={{ marginBottom: 14, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{p.name || "(geen naam)"}</div>
                <div style={{ fontSize: 12, color: "#8A7968" }}>{p.email}</div>
              </div>
              <span className={`role-badge ${p.role}`}>{p.role === "owner" ? "🏡 Eigenaar" : "🎒 Buddy"}</span>
            </div>
            <div style={{ fontSize: 13, color: "#8A7968", marginBottom: 4 }}>
              {p.city}{p.city && p.country ? ", " : ""}{p.country} {p.tagline ? `· "${p.tagline}"` : ""}
            </div>
            {p.bio && <p style={{ fontSize: 13, marginBottom: 10 }}>{p.bio}</p>}
            <div style={{ fontSize: 12, color: "#8A7968", marginBottom: 10 }}>
              Status: <strong style={{ color: "#C4622D" }}>{p.status}</strong>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" style={{ flex: 1, margin: 0 }} onClick={() => setPreviewProfile(p)}>👁️ Bekijken</button>
              <button className="btn-main" style={{ flex: 1, margin: 0 }} onClick={() => setStatus(p.id, "approved")}>✅ Goedkeuren</button>
              <button className="btn-ghost" style={{ flex: 1, margin: 0 }} onClick={() => setStatus(p.id, "rejected")}>🚫 Afkeuren</button>
              <button className="btn-ghost" style={{ flex: 1, margin: 0, color: "#9E4A1E", borderColor: "#9E4A1E" }} onClick={() => handleDelete(p)}>🗑️ Verwijderen</button>
            </div>
          </div>
        ))
      )}

      {previewProfile && (
        <div className="modal-bg" onClick={() => setPreviewProfile(null)} style={{ alignItems: "stretch", justifyContent: "stretch" }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "#FDF6EC", maxWidth: 430, width: "100%", margin: "0 auto", maxHeight: "100vh", overflowY: "auto", position: "relative" }}
          >
            <button
              onClick={() => setPreviewProfile(null)}
              style={{ position: "absolute", top: 16, right: 16, zIndex: 10, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 16, cursor: "pointer" }}
            >✕</button>
            <FullProfile
              profile={toDisplayProfile(previewProfile)}
              onBack={() => setPreviewProfile(null)}
              onChat={() => {}}
              isLoggedIn={true}
              onLogin={() => {}}
            />
            <div style={{ display: "flex", gap: 8, padding: "0 20px 24px" }}>
              <button className="btn-main" style={{ flex: 1, margin: 0 }} onClick={() => { setStatus(previewProfile.id, "approved"); setPreviewProfile(null); }}>✅ Goedkeuren</button>
              <button className="btn-ghost" style={{ flex: 1, margin: 0 }} onClick={() => { setStatus(previewProfile.id, "rejected"); setPreviewProfile(null); }}>🚫 Afkeuren</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [checkEmailAddress, setCheckEmailAddress] = useState(null);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [screen, setScreen] = useState("browse");
  const [tab, setTab] = useState("browse");
  const [viewProfile, setViewProfile] = useState(null);
  const [chatProfile, setChatProfile] = useState(null);
  const [messages, setMessages] = useState(MESSAGES_INIT);
  const [likes, setLikes] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [dbProfiles, setDbProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.hash === "#admin");
  const [adminUnlocked, setAdminUnlocked] = useState(() => {
    try { return localStorage.getItem("bnbbuddy_admin_unlocked") === "true"; } catch (e) { return false; }
  });

  useEffect(() => {
    const onHashChange = () => setIsAdminRoute(window.location.hash === "#admin");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const lockAdmin = () => {
    try { localStorage.removeItem("bnbbuddy_admin_unlocked"); } catch (e) {}
    setAdminUnlocked(false);
    window.location.hash = "";
  };
  const unlockAdmin = () => {
    try { localStorage.setItem("bnbbuddy_admin_unlocked", "true"); } catch (e) {}
    setAdminUnlocked(true);
  };

  // Load approved profiles from Supabase on mount
  useEffect(() => {
    getApprovedProfiles()
      .then(data => {
        if (data && data.length > 0) setDbProfiles(data.map(p => ({
          ...p,
          avatar: p.avatar_url || "https://i.pravatar.cc/400?img=47",
          photos: (p.photos || []).filter(ph => ph.type === "gallery").map(ph => ph.url),
          tripDuration: p.trip_duration || "",
          beschikbaarVan: p.beschikbaar_van || "",
          beschikbaarTot: p.beschikbaar_tot || "",
          flexibeleData: p.flexibele_data || false,
          aantalPersonen: p.aantal_personen || "",
          pricePerNight: p.price_from && p.price_to ? `€${p.price_from}–€${p.price_to}` : "",
          propertyName: p.property_name || "",
          propertyType: p.property_type || "",
          hostingSince: p.hosting_since || "",
          bio: p.bio || "",
          tagline: p.tagline || "",
          amenities: p.amenities || [],
          interests: p.interests || [],
          languages: p.languages || [],
          focusY: p.focus_y ?? 25,
          focusX: p.focus_x ?? 50,
        })));
      })
      .catch(() => {}) // fallback to demo profiles on error
      .finally(() => setLoadingProfiles(false));
  }, []);

  // Detect email confirmation from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=signup") || hash.includes("type=magiclink")) {
      setEmailConfirmed(true);
      window.history.replaceState(null, "", window.location.pathname);
    }
    if (hash.includes("error=access_denied")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // Check for existing session on load
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        try {
          const profile = await getProfile(session.user.id);
          if (profile) setUser({ ...profile, avatar: profile.avatar_url || "https://i.pravatar.cc/80?img=12" });
          else setUser({ id: session.user.id, email: session.user.email, name: session.user.email.split("@")[0], role: "buddy", avatar: "https://i.pravatar.cc/80?img=12", isNew: true });
        } catch (e) {
          setUser({ id: session.user.id, email: session.user.email, name: session.user.email.split("@")[0], role: "buddy", avatar: "https://i.pravatar.cc/80?img=12", isNew: true });
        }
      }
    });
  }, []);

  const allProfiles = dbProfiles.length > 0 ? dbProfiles : PROFILES;

  const login = u => { setUser(u); setShowAuth(false); if (u.isNew) setScreen("create-profile"); };
  const handleLogout = async () => {
    try { await signOut(); } catch (e) { console.error(e); }
    setUser(null); setScreen("browse"); setTab("browse"); setViewProfile(null); setChatProfile(null);
  };
  const handleSignupSuccess = (email) => { setShowAuth(false); setCheckEmailAddress(email); };
  const openSignup = () => { setAuthMode("signup"); setShowAuth(true); };
  const openLogin = () => { setAuthMode("login"); setShowAuth(true); };

  const profileDone = async (form) => {
    if (user) {
      try {
        await upsertProfile(user.id, {
          name: form.name || user.name,
          email: user.email,
          role: user.role,
          status: 'pending',
          city: form.city, country: form.country,
          age: form.age ? parseInt(form.age) : null,
          tagline: form.tagline, bio: form.bio,
          languages: form.languages, interests: form.interests,
          vaardigheden: form.vaardigheden,
          bestemmingen: Array.isArray(form.bestemmingen) ? form.bestemmingen.filter(Boolean).join(", ") : form.bestemmingen,
          trip_duration: form.tripDuration,
          beschikbaar_van: form.beschikbaarVan || null,
          beschikbaar_tot: form.beschikbaarTot || null,
          flexibele_data: form.flexibeleData,
          maanden: form.maanden,
          aantal_personen: form.aantalPersonen,
          overige_taal: form.overigeTaal,
          overige_interesse: form.overigeInteresse,
          property_name: form.propertyName,
          property_type: form.propertyType,
          rooms: form.rooms ? parseInt(form.rooms) : null,
          price_from: form.priceVan ? parseFloat(form.priceVan) : null,
          price_to: form.priceTot ? parseFloat(form.priceTot) : null,
          amenities: form.amenities,
          house_rules: form.houseRules,
          focus_y: form.focusY,
          focus_x: form.focusX,
        });

        // Upload avatar (profile photo) to Storage and save its URL — only if it's a newly selected local file
        if (form.avatar && form.avatar.startsWith("data:")) {
          try {
            const avatarFile = dataUrlToFile(form.avatar, `avatar.jpg`);
            const avatarUrl = await uploadPhoto(user.id, avatarFile, 'avatar');
            await upsertProfile(user.id, { avatar_url: avatarUrl });
            setUser(u => ({ ...u, avatar: avatarUrl }));
          } catch (e) { console.error("Avatar upload error:", e); }
        }

        // Upload gallery photos (property/travel photos) to Storage — only new local selections, skip already-uploaded URLs
        const newPhotos = (form.photos || []).filter(p => p.startsWith("data:"));
        if (newPhotos.length > 0) {
          for (let i = 0; i < newPhotos.length; i++) {
            try {
              const photoFile = dataUrlToFile(newPhotos[i], `photo-${Date.now()}-${i}.jpg`);
              await uploadPhoto(user.id, photoFile, 'gallery');
            } catch (e) { console.error("Photo upload error:", e); }
          }
        }
      } catch (e) { console.error(e); }
    }
    setScreen("under-review");
  };

  const loadConversation = async (otherId) => {
    if (!user) return;
    try {
      const rows = await getMessages(user.id, otherId);
      const formatted = rows.map(r => ({ from: r.sender_id === user.id ? "me" : "them", text: r.text }));
      setMessages(p => ({ ...p, [otherId]: formatted }));
    } catch (e) { console.error("Load messages error:", e); }
  };

  // Load real conversation history from Supabase whenever a real (non-demo) chat is opened
  useEffect(() => {
    if (chatProfile && user && typeof chatProfile.id === "string") {
      loadConversation(chatProfile.id);
    }
  }, [chatProfile?.id, user?.id]);

  const send = async (profileId, text) => {
    setMessages(p => ({ ...p, [profileId]: [...(p[profileId] || []), { from: "me", text }] }));
    if (user) {
      try { await sendMessage(user.id, profileId, text); } catch (e) {}
    }
  };

  const openChat = p => {
    setViewProfile(null); setChatProfile(p);
    if (!likes.includes(p.id)) setLikes(l => [...l, p.id]);
    if (user) likeProfile(user.id, p.id).catch(() => {});
    setTab("messages");
  };

  const filtered = (roleFilter === "all" ? allProfiles : allProfiles.filter(p => p.role === roleFilter));
  const matched = allProfiles.filter(p => likes.includes(p.id));

  if (isAdminRoute) return (
    <div className="wrap" style={{ maxWidth: "100%" }}>
      <style>{css}</style>
      {adminUnlocked ? <AdminPanel onLock={lockAdmin} /> : <AdminGate onUnlock={unlockAdmin} />}
    </div>
  );

  if (checkEmailAddress) return (
    <div className="wrap">
      <style>{css}</style>
      <CheckEmail email={checkEmailAddress} onBackToLogin={() => { setCheckEmailAddress(null); openLogin(); }} />
    </div>
  );

  if (emailConfirmed) return (
    <div className="wrap">
      <style>{css}</style>
      <EmailBevestigd onLogin={() => { setEmailConfirmed(false); setAuthMode("login"); setShowAuth(true); }} />
    </div>
  );

  if (chatProfile && tab === "messages") return (
    <div className="wrap">
      <style>{css}</style>
      <ChatView profile={chatProfile} messages={messages[chatProfile.id] || []} onBack={() => setChatProfile(null)} onSend={send} />
    </div>
  );
  if (screen === "create-profile" && user) return (
    <div className="wrap"><style>{css}</style><CreateProfile user={user} onDone={profileDone} onClose={() => setScreen("browse")} /></div>
  );
  if (screen === "under-review" && user) return (
    <div className="wrap"><style>{css}</style><UnderReview user={user} onBrowse={() => setScreen("browse")} /></div>
  );

  return (
    <div className="wrap">
      <style>{css}</style>

      <div className="nav">
        <div className="nav-logo" onClick={() => { setScreen("browse"); setTab("browse"); setViewProfile(null); setChatProfile(null); }} style={{ cursor: "pointer" }}>
          <img src="/logo.png" alt="BnbBuddy" style={{ height: 32, display: "block" }} />
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <span style={{ fontSize: 13, color: "#8A7968" }}>Hoi, {user.name}</span>
              <span className={`role-badge ${user.role}`} style={{ fontSize: 10, padding: "3px 8px" }}>{user.role === "owner" ? "🏡" : "🎒"}</span>
              <button className="btn-nav" onClick={() => { setTab("messages"); setScreen("browse"); setViewProfile(null); setChatProfile(null); }} style={{ fontSize: 12, padding: "5px 10px" }}>💬 Berichten</button>
              <button className="btn-nav" onClick={() => { setScreen("browse"); setViewProfile(toDisplayProfile(user)); }} style={{ fontSize: 12, padding: "5px 10px" }}>Mijn profiel</button>
              <button className="btn-nav" onClick={handleLogout} style={{ fontSize: 12, padding: "5px 10px" }}>Uitloggen</button>
              <img src={user.avatar} alt="me" className="nav-avatar" />
            </>
          ) : (
            <>
              <button className="btn-nav" onClick={openLogin}>Log in</button>
              <button className="btn-nav primary" onClick={openSignup}>Word gratis lid</button>
            </>
          )}
        </div>
      </div>

      <div className="main-content">
        {viewProfile ? (
          <FullProfile profile={viewProfile} onBack={() => setViewProfile(null)} onChat={openChat}
            isLoggedIn={!!user} onLogin={() => { setViewProfile(null); openLogin(); }}
            isOwnProfile={!!user && viewProfile.id === user.id}
            onEdit={() => { setViewProfile(null); setScreen("create-profile"); }} />
        ) : tab === "browse" ? (
          <>
            {!user && (
              <div className="hero">
                <h1>Vind je <em>BNB/Buddy</em></h1>
                <p>Kom in contact met BNB-eigenaren en Buddy's die bij jouw stijl en bestemming passen.</p>
                <button className="btn-hero" onClick={openSignup}>Word gratis lid</button>
              </div>
            )}
            <div className="sec-head">
              <h2>Bekijk profielen</h2>
              <span style={{ fontSize: 12, color: "#8A7968" }}>{filtered.length} gevonden</span>
            </div>
            <div className="filter-pills">
              <button className={`pill ${roleFilter === "all" ? "active" : ""}`} onClick={() => setRoleFilter("all")}><GlobeIcon /> Iedereen</button>
              <button className={`pill ${roleFilter === "owner" ? "active" : ""}`} onClick={() => setRoleFilter("owner")}><HouseIcon /> BNB-eigenaar</button>
              <button className={`pill ${roleFilter === "buddy" ? "active" : ""}`} onClick={() => setRoleFilter("buddy")}><PeopleIcon /> Buddy</button>
            </div>
            <div className="profile-grid">
              {filtered.map(p => (
                <ProfileCard key={p.id} profile={p} isLoggedIn={!!user} onView={setViewProfile} onLogin={openLogin} />
              ))}
            </div>
            {!filtered.length && <div className="empty"><div className="ei">🔍</div><h3>No profiles gevonden</h3><p>Probeer een ander filter.</p></div>}
          </>
        ) : (
          <>
            <div className="sec-head"><h2>Jouw berichten</h2></div>
            <MatchesTab matches={matched} onOpenChat={p => { setChatProfile(p); setTab("messages"); }} />
          </>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={login} onSignupSuccess={handleSignupSuccess} initialMode={authMode} />}
    </div>
  );
}
