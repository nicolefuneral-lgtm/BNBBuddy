import { useState, useRef, useEffect } from "react";
import { supabase, signUp, signIn, getProfile, updateProfile, getApprovedProfiles, uploadPhoto, sendMessage, getMessages, likeProfile, getLikes } from "./supabase.js";

const C = {
  cream: "#FDF6EC", sand: "#F2E4CC", terra: "#C4622D",
  terradark: "#9E4A1E", sage: "#7A9E7E", charcoal: "#2C2C2C",
  muted: "#8A7968", white: "#FFFFFF", blush: "#F4C9A8",
};

const PROFILES = [
  {
    id: 1, name: "Sofia", age: 28, city: "Amsterdam", country: "🇳🇱 Netherlands",
    tagline: "Slow travel & strong coffee", role: "buddy", verified: true,
    bio: "I've been living out of a suitcase for 3 years — not because I'm lost, but because I keep finding places worth staying. Looking for a travel buddy who appreciates farmers markets over tourist traps.",
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
const TRAVEL_STYLES = ["Slow explorer","Adventure seeker","Cultural immersionist","Mindful wanderer","Spontaneous roamer","Luxury traveller","Budget backpacker","Digital nomad"];
const PROPERTY_TYPES = ["Private room","Entire apartment","Farmhouse B&B","Cabin / Retreat","Boutique guesthouse","Villa","Treehouse","Houseboat"];
const AMENITIES_LIST = ["Breakfast included","WiFi","Parking","Garden","Pool","Sauna","Bike rental","Kitchen","Pets allowed","EV charger","Workspace","City tours"];
const BUDGETS = ["Budget-friendly","Mid-range","Flexible","Comfortable","Luxury"];
const DURATIONS = ["Weekend","1 week","1-2 weeks","2-4 weeks","1+ month","Flexible"];
const LOOKING_FOR = ["Travel companion","Local host","Co-traveller","Female travel companion","Anyone adventurous!","Cultural exchange"];

// ── STYLES ───────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:#FDF6EC;color:#2C2C2C;min-height:100vh;}
.wrap{max-width:430px;margin:0 auto;min-height:100vh;background:#FDF6EC;position:relative;}
.nav{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;background:#FDF6EC;border-bottom:1px solid #F2E4CC;position:sticky;top:0;z-index:50;}
.nav-logo{font-family:'Playfair Display',serif;font-size:22px;color:#C4622D;font-weight:600;}
.nav-logo span{font-style:italic;color:#7A9E7E;}
.nav-actions{display:flex;gap:10px;align-items:center;}
.btn-nav{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#8A7968;padding:6px 14px;border-radius:20px;transition:all 0.2s;}
.btn-nav:hover{color:#C4622D;background:#F2E4CC;}
.btn-nav.primary{background:#C4622D;color:white;}
.btn-nav.primary:hover{background:#9E4A1E;}
.nav-avatar{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid #F4C9A8;cursor:pointer;}
.bottom-tab{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:white;border-top:1px solid #F2E4CC;display:flex;z-index:50;}
.tab-btn{flex:1;padding:14px 0 10px;background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;color:#8A7968;transition:color 0.2s;}
.tab-btn.active{color:#C4622D;}
.tab-icon{font-size:20px;}
.hero{padding:28px 20px 20px;background:linear-gradient(135deg,#F2E4CC 0%,#FDF6EC 60%);}
.hero h1{font-family:'Playfair Display',serif;font-size:30px;line-height:1.2;margin-bottom:8px;}
.hero h1 em{color:#C4622D;font-style:italic;}
.hero p{font-size:14px;color:#8A7968;line-height:1.6;margin-bottom:16px;}
.btn-hero{display:inline-flex;align-items:center;gap:8px;background:#C4622D;color:white;border:none;padding:12px 22px;border-radius:28px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:background 0.2s;}
.btn-hero:hover{background:#9E4A1E;}
.sec-head{padding:20px 20px 12px;display:flex;align-items:baseline;justify-content:space-between;}
.sec-head h2{font-family:'Playfair Display',serif;font-size:18px;}
.filter-pills{display:flex;gap:8px;padding:0 20px 14px;overflow-x:auto;scrollbar-width:none;}
.pill{flex-shrink:0;padding:8px 16px;border-radius:24px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;background:white;color:#8A7968;border:1.5px solid #F2E4CC;transition:all 0.2s;}
.pill.active{background:#C4622D;color:white;border-color:#C4622D;}
.card{margin:0 20px 16px;border-radius:20px;overflow:hidden;background:white;box-shadow:0 2px 16px rgba(0,0,0,0.07);cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;}
.card:hover{transform:translateY(-3px);box-shadow:0 6px 24px rgba(0,0,0,0.11);}
.card-img{position:relative;height:260px;overflow:hidden;}
.card-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s;}
.card:hover .card-img img{transform:scale(1.03);}
.card-overlay{position:absolute;bottom:0;left:0;right:0;padding:20px 16px 14px;background:linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 100%);color:white;}
.card-overlay h3{font-family:'Playfair Display',serif;font-size:22px;font-weight:600;margin-bottom:2px;}
.card-overlay .loc{font-size:12px;opacity:0.85;}
.badge-verified{position:absolute;top:12px;right:12px;background:#7A9E7E;color:white;font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;}
.role-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;}
.role-badge.owner{background:#EAF2FF;color:#2563EB;}
.role-badge.buddy{background:#FEF3EC;color:#C4622D;}
.card-body{padding:14px 16px 16px;position:relative;}
.card-tagline{font-size:14px;color:#8A7968;font-style:italic;}
.snap-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
.snap{font-size:12px;font-weight:500;padding:4px 10px;border-radius:10px;}
.snap.owner{background:#EAF2FF;color:#2563EB;}
.snap.buddy{background:#FEF3EC;color:#C4622D;}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
.tag{background:#F2E4CC;color:#2C2C2C;font-size:11px;font-weight:500;padding:4px 10px;border-radius:12px;}
.tag.sage{background:#e8f0e9;color:#7A9E7E;}
.lock-bar{background:linear-gradient(to bottom,rgba(253,246,236,0) 30%,rgba(253,246,236,0.97) 65%);position:absolute;bottom:0;left:0;right:0;height:110px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:16px;}
.btn-lock{background:#C4622D;color:white;border:none;padding:10px 22px;border-radius:24px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;}
.modal-bg{position:fixed;inset:0;background:rgba(44,44,44,0.55);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease;}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.modal{background:#FDF6EC;border-radius:28px 28px 0 0;padding:28px 24px 36px;width:100%;max-width:430px;max-height:85vh;overflow-y:auto;animation:slideUp 0.3s cubic-bezier(0.34,1.2,0.64,1);}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.modal-handle{width:40px;height:4px;background:#F2E4CC;border-radius:2px;margin:0 auto 22px;}
.modal h2{font-family:'Playfair Display',serif;font-size:26px;margin-bottom:6px;}
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
.role-card .rt{font-family:'Playfair Display',serif;font-size:15px;font-weight:600;margin-bottom:4px;}
.role-card .rd{font-size:11px;color:#8A7968;line-height:1.4;}
.role-card .rck{position:absolute;top:10px;right:10px;width:20px;height:20px;border-radius:50%;background:#C4622D;color:white;font-size:11px;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;}
.role-card.sel .rck{opacity:1;}
.prof-wrap{padding-bottom:100px;}
.prof-hero{position:relative;height:340px;overflow:hidden;}
.prof-hero img{width:100%;height:100%;object-fit:cover;}
.prof-hero-over{position:absolute;bottom:0;left:0;right:0;padding:28px 20px 20px;background:linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 100%);color:white;}
.prof-hero-over h2{font-family:'Playfair Display',serif;font-size:30px;}
.prof-hero-over .subloc{font-size:13px;opacity:0.85;margin-top:2px;}
.back-btn{position:absolute;top:16px;left:16px;background:rgba(255,255,255,0.85);border:none;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:5;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.12);}
.stat-row{display:flex;gap:10px;padding:16px 20px;overflow-x:auto;scrollbar-width:none;}
.stat{flex-shrink:0;background:white;border:1px solid #F2E4CC;border-radius:14px;padding:10px 14px;text-align:center;min-width:80px;}
.stat .sl{font-size:10px;color:#8A7968;text-transform:uppercase;letter-spacing:0.4px;}
.stat .sv{font-size:13px;font-weight:500;color:#2C2C2C;margin-top:2px;}
.prof-sec{padding:16px 20px 0;}
.prof-sec h4{font-family:'Playfair Display',serif;font-size:16px;color:#C4622D;margin-bottom:10px;}
.prof-sec p{font-size:14px;line-height:1.7;}
.action-bar{position:fixed;bottom:64px;left:50%;transform:translateX(-50%);width:calc(100% - 40px);max-width:390px;display:flex;gap:12px;z-index:40;}
.action-bar button{flex:1;padding:15px;border-radius:16px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;border:none;}
.btn-like{background:#C4622D;color:white;}
.btn-msg-out{background:white;color:#C4622D;border:1.5px solid #F4C9A8!important;}
.matches-list{padding:0 20px 100px;}
.match-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #F2E4CC;cursor:pointer;}
.match-row:last-child{border-bottom:none;}
.match-av{position:relative;}
.match-av img{width:52px;height:52px;border-radius:50%;object-fit:cover;border:2px solid #F4C9A8;}
.online-dot{position:absolute;bottom:1px;right:1px;width:12px;height:12px;background:#7A9E7E;border-radius:50%;border:2px solid white;}
.match-info{flex:1;}
.match-name{font-weight:500;font-size:15px;margin-bottom:3px;}
.match-prev{font-size:13px;color:#8A7968;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;}
.match-time{font-size:11px;color:#8A7968;}
.chat-wrap{display:flex;flex-direction:column;height:calc(100vh - 0px);}
.chat-head{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid #F2E4CC;background:#FDF6EC;}
.chat-head img{width:40px;height:40px;border-radius:50%;object-fit:cover;}
.chat-name{font-weight:500;font-size:15px;}
.chat-status{font-size:12px;color:#7A9E7E;}
.chat-back{background:none;border:none;font-size:20px;cursor:pointer;color:#8A7968;}
.chat-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}
.bubble{max-width:75%;padding:11px 16px;border-radius:20px;font-size:14px;line-height:1.5;}
.bubble.me{background:#C4622D;color:white;border-bottom-right-radius:6px;align-self:flex-end;}
.bubble.them{background:white;color:#2C2C2C;border-bottom-left-radius:6px;align-self:flex-start;box-shadow:0 1px 4px rgba(0,0,0,0.06);}
.chat-input{display:flex;align-items:center;gap:10px;padding:12px 16px;background:white;border-top:1px solid #F2E4CC;}
.chat-input input{flex:1;padding:11px 16px;border:1.5px solid #F2E4CC;border-radius:24px;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;background:#FDF6EC;}
.chat-input input:focus{border-color:#C4622D;}
.send-btn{background:#C4622D;color:white;border:none;width:42px;height:42px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;}
.empty{text-align:center;padding:60px 30px;}
.empty .ei{font-size:48px;margin-bottom:16px;}
.empty h3{font-family:'Playfair Display',serif;font-size:20px;margin-bottom:8px;}
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
  .wrap{max-width:100%;display:grid;grid-template-columns:280px 1fr;grid-template-rows:64px 1fr;min-height:100vh;}
  .nav{grid-column:1/-1;grid-row:1;max-width:100%;padding:0 32px;height:64px;}
  .bottom-tab{position:static;grid-column:1;grid-row:2;flex-direction:column;max-width:280px;border-top:none;border-right:1px solid #F2E4CC;padding:24px 0;height:100%;width:280px;transform:none;left:auto;align-items:flex-start;}
  .tab-btn{flex-direction:row;padding:14px 24px;font-size:15px;gap:12px;width:100%;justify-content:flex-start;}
  .main-content{grid-column:2;grid-row:2;overflow-y:auto;padding-bottom:40px;}
  .profile-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;padding:0 24px 24px;}
  .card{margin:0;}
  .hero{padding:40px 32px 32px;}
  .hero h1{font-size:40px;}
  .sec-head{padding:24px 32px 12px;}
  .filter-pills{padding:0 32px 16px;}
  .matches-list{padding:0 32px 40px;}
}
@media(min-width:1200px){
  .wrap{grid-template-columns:300px 1fr;}
  .bottom-tab{width:300px;max-width:300px;}
  .profile-grid{grid-template-columns:repeat(3,1fr);}
}
`;

// ── AUTH MODAL ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email || !password) return;
    if (mode === "signup" && !role) return;
    setLoading(true); setError("");
    try {
      if (mode === "signup") {
        await signUp({ email, password, name: name || email.split("@")[0], role });
        onLogin({ name: name || email.split("@")[0], email, role, avatar: "https://i.pravatar.cc/80?img=12", isNew: true });
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
        <h2>{mode === "login" ? "Welcome back" : "Join BnbBuddy"}</h2>
        <p className="sub">{mode === "login" ? "Log in to see full profiles & chat" : "Tell us who you are to get started"}</p>
        {mode === "signup" && (
          <>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#8A7968", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>I am a…</div>
            <div className="role-cards">
              <div className={`role-card ${role === "owner" ? "sel" : ""}`} onClick={() => setRole("owner")}>
                <div className="rck">✓</div>
                <div className="ri">🏡</div>
                <div className="rt">BnB Owner</div>
                <div className="rd">I host travellers and want to connect with the right guests</div>
              </div>
              <div className={`role-card ${role === "buddy" ? "sel" : ""}`} onClick={() => setRole("buddy")}>
                <div className="rck">✓</div>
                <div className="ri">🎒</div>
                <div className="rt">Buddy</div>
                <div className="rd">I'm a traveller looking for a stay or travel companion</div>
              </div>
            </div>
            {!role && <div style={{ fontSize: 12, color: "#C4622D", marginBottom: 8 }}>Please select a role to continue</div>}
            <div className="field"><label>Your name</label><input placeholder="First name" value={name} onChange={e => setName(e.target.value)} /></div>
          </>
        )}
        <div className="field"><label>Email</label><input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="field"><label>Password</label><input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
        {error && <div style={{ fontSize: 13, color: "#C4622D", marginBottom: 8, padding: "8px 12px", background: "#FEF3EC", borderRadius: 8 }}>{error}</div>}
        <button className="btn-main" onClick={submit} style={{ opacity: (mode === "signup" && !role) || loading ? 0.5 : 1 }}>
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"} →
        </button>
        <button className="btn-ghost" onClick={onClose}>Continue browsing</button>
        <div className="modal-toggle">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setRole(null); }}>
            {mode === "login" ? "Create account" : "Log in"}
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
        <img src={profile.avatar} alt={profile.name} />
        {profile.verified && <span className="badge-verified">✓ Verified</span>}
        <div className="card-overlay">
          <h3>{profile.name}{!isOwner ? `, ${profile.age}` : ""}</h3>
          <div className="loc">{profile.country} · {profile.city}</div>
        </div>
      </div>
      <div className="card-body">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
          <div className="card-tagline">"{profile.tagline}"</div>
          <span className={`role-badge ${profile.role}`}>{isOwner ? "🏡 Owner" : "🎒 Buddy"}</span>
        </div>
        {isOwner ? (
          <>
            <div className="snap-row">
              <span className="snap owner">🏠 {profile.propertyType}</span>
              <span className="snap owner">🛏 {profile.rooms} room{profile.rooms > 1 ? "s" : ""}</span>
              <span className="snap owner">💶 {profile.pricePerNight}</span>
            </div>
            <div className="tags">{profile.amenities.slice(0, 3).map(a => <span className="tag" key={a}>{a}</span>)}</div>
          </>
        ) : (
          <>
            <div className="snap-row">
              <span className="snap buddy">✈ {profile.nextDestination}</span>
              <span className="snap buddy">⏱ {profile.tripDuration}</span>
            </div>
            <div className="snap-row" style={{ marginTop: 4 }}>
              <span className="snap buddy">💰 {profile.budget}</span>
              <span className="snap buddy">🤝 {profile.lookingFor}</span>
            </div>
            <div className="tags">{profile.interests.slice(0, 3).map(t => <span className="tag" key={t}>{t}</span>)}</div>
          </>
        )}
        {!isLoggedIn && (
          <div className="lock-bar">
            <button className="btn-lock" onClick={e => { e.stopPropagation(); onLogin(); }}>🔒 Log in to read bio & chat</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FULL PROFILE ──────────────────────────────────────────────────────────────
function FullProfile({ profile, onBack, onChat, isLoggedIn, onLogin }) {
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
            {isOwner ? "🏡 BnB Owner" : "🎒 Buddy"}
          </span>
        </div>
        {profile.verified && <span className="badge-verified" style={{ position: "absolute", top: 14, right: 14 }}>✓ Verified</span>}
      </div>

      <div className="stat-row">
        {isOwner ? (
          <>
            <div className="stat"><div className="sl">Property</div><div className="sv">{profile.propertyType}</div></div>
            <div className="stat"><div className="sl">Rooms</div><div className="sv">{profile.rooms}</div></div>
            <div className="stat"><div className="sl">Price/night</div><div className="sv">{profile.pricePerNight}</div></div>
            <div className="stat"><div className="sl">Since</div><div className="sv">{profile.hostingSince}</div></div>
          </>
        ) : (
          <>
            <div className="stat"><div className="sl">Next trip</div><div className="sv">{profile.nextDestination}</div></div>
            <div className="stat"><div className="sl">Duration</div><div className="sv">{profile.tripDuration}</div></div>
            <div className="stat"><div className="sl">Budget</div><div className="sv">{profile.budget}</div></div>
            <div className="stat"><div className="sl">Style</div><div className="sv">{profile.travelStyle}</div></div>
          </>
        )}
      </div>

      <div style={{ padding: "0 20px", display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
        {profile.languages.map(l => <span className="tag sage" key={l}>🌐 {l}</span>)}
      </div>

      {isOwner && (
        <div className="prof-sec">
          <h4>🏡 {profile.propertyName}</h4>
          <div className="tags">{profile.amenities.map(a => <span className="tag" key={a}>{a}</span>)}</div>
        </div>
      )}
      {!isOwner && (
        <div className="prof-sec">
          <h4>Looking for</h4>
          <p style={{ color: "#C4622D", fontWeight: 500 }}>🤝 {profile.lookingFor}</p>
        </div>
      )}

      <div className="prof-sec" style={{ marginTop: 16 }}>
        <h4>About {profile.name}</h4>
        {isLoggedIn ? (
          <p>{profile.bio}</p>
        ) : (
          <div style={{ position: "relative" }}>
            <p style={{ lineHeight: 1.7, fontSize: 14 }}>{profile.bio.split(" ").slice(0, 28).join(" ")}…</p>
            <div style={{ position: "relative", marginTop: 4 }}>
              <p style={{ lineHeight: 1.7, fontSize: 14, filter: "blur(3.5px)", userSelect: "none", maskImage: "linear-gradient(to bottom,black 0%,transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom,black 0%,transparent 100%)" }}>
                {profile.bio.split(" ").slice(28).join(" ")}
              </p>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", paddingBottom: 4 }}>
                <button className="btn-lock" onClick={onLogin} style={{ fontSize: 13, padding: "9px 20px" }}>🔒 Log in to read more</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="prof-sec" style={{ marginTop: 16 }}>
        <h4>Interests</h4>
        <div className="tags">{profile.interests.map(t => <span className="tag" key={t}>{t}</span>)}</div>
      </div>

      <div className="prof-sec" style={{ marginTop: 16 }}>
        <h4>{isOwner ? "Property photos" : "Travel photos"}</h4>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {profile.photos.map((p, i) => (
            <img key={i} src={p} alt="photo" style={{ width: "calc(50% - 5px)", aspectRatio: "1", objectFit: "cover", borderRadius: 14 }} />
          ))}
        </div>
      </div>

      <div className="action-bar">
        <button className="btn-msg-out" onClick={onBack}>← Back</button>
        {isLoggedIn
          ? <button className="btn-like" onClick={() => onChat(profile)}>💬 Message</button>
          : <button className="btn-like" onClick={onLogin}>🔒 Log in to chat</button>
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
        <input placeholder={`Message ${profile.name}…`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
        <button className="send-btn" onClick={send}>➤</button>
      </div>
    </div>
  );
}

// ── MATCHES ───────────────────────────────────────────────────────────────────
function MatchesTab({ matches, onOpenChat }) {
  if (!matches.length) return (
    <div className="empty"><div className="ei">🌍</div><h3>No matches yet</h3><p>Browse profiles and start conversations. Your travel buddy is out there!</p></div>
  );
  return (
    <div className="matches-list">
      {matches.map(p => (
        <div className="match-row" key={p.id} onClick={() => onOpenChat(p)}>
          <div className="match-av"><img src={p.avatar} alt={p.name} /><div className="online-dot" /></div>
          <div className="match-info">
            <div className="match-name">{p.name}</div>
            <div className="match-prev">{p.role === "owner" ? `🏡 ${p.propertyName}` : `✈ ${p.nextDestination}`}</div>
          </div>
          <div className="match-time">now</div>
        </div>
      ))}
    </div>
  );
}

// ── MULTI SELECT ──────────────────────────────────────────────────────────────
function MultiSelect({ options, selected, onToggle, max }) {
  return (
    <div className="ms">
      {options.map(o => {
        const on = selected.includes(o);
        const disabled = max && !on && selected.length >= max;
        return <button key={o} className={on ? "on" : ""} onClick={() => !disabled && onToggle(o)} style={{ opacity: disabled ? 0.4 : 1 }}>{o}</button>;
      })}
    </div>
  );
}

// ── PHOTO UPLOAD ──────────────────────────────────────────────────────────────
function PhotoStep({ avatar, photos, isOwner, onAvatar, onPhotos }) {
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
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 6 }}>Add your photos</h2>
      <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>A profile photo helps people recognise you. {isOwner ? "Property" : "Travel"} photos help you stand out.</p>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#8A7968", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Profile photo</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <div className="avatar-ring">{avatar ? <img src={avatar} alt="av" /> : <span style={{ fontSize: 28 }}>👤</span>}</div>
            <label className="av-plus">＋<input type="file" accept="image/*" onChange={handleAvatar} style={{ display: "none" }} /></label>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{avatar ? "Looking great! 🎉" : "Upload a clear photo of yourself"}</div>
            <div style={{ fontSize: 12, color: "#8A7968" }}>Square photos work best.</div>
          </div>
        </div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#8A7968", textTransform: "uppercase", letterSpacing: "0.5px" }}>{isOwner ? "Property photos" : "Travel photos"}</div>
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
              <span style={{ fontSize: 11, color: "#8A7968" }}>Add photo</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: "none" }} />
            </label>
          )}
        </div>
        {!photos.length && <p style={{ fontSize: 12, color: "#8A7968", marginTop: 10, fontStyle: "italic" }}>Photos are optional but profiles with photos get 3× more matches!</p>}
      </div>
    </div>
  );
}

// ── CREATE PROFILE ────────────────────────────────────────────────────────────
function CreateProfile({ user, onDone }) {
  const isOwner = user.role === "owner";
  const STEPS = 6;
  const [step, setStep] = useState(1);
  const titles = isOwner
    ? ["Basic info", "Your story", "Your property", "Amenities & price", "Interests", "Photos"]
    : ["Basic info", "Your story", "Travel plans", "Preferences", "Interests", "Photos"];
  const [form, setForm] = useState({
    tagline: "", bio: "", city: "", country: "", age: "",
    languages: [], interests: [],
    travelStyle: "", nextDestination: "", tripDuration: "", budget: "", lookingFor: [],
    propertyName: "", propertyType: "", rooms: "", priceFrom: "", priceTo: "", amenities: [], houseRules: "",
    avatar: null, photos: [],
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const tog = (k, v) => setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }));
  const ok = () => {
    if (step === 1) return form.city && form.country && (isOwner || form.age);
    if (step === 2) return form.tagline && form.bio;
    if (step === 3) return isOwner ? (form.propertyName && form.propertyType && form.rooms) : (form.travelStyle && form.nextDestination);
    if (step === 4) return isOwner ? form.amenities.length > 0 : (form.budget && form.tripDuration);
    if (step === 5) return form.languages.length > 0 && form.interests.length > 0;
    return true;
  };
  const sb = (val, cur) => ({ padding: "8px 14px", borderRadius: 20, border: "1.5px solid", borderColor: cur === val ? "#C4622D" : "#F2E4CC", background: cur === val ? "#FEF3EC" : "white", color: cur === val ? "#C4622D" : "#2C2C2C", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: cur === val ? 600 : 400 });

  return (
    <div style={{ minHeight: "100vh", background: "#FDF6EC", paddingBottom: 40 }}>
      <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #F2E4CC", display: "flex", alignItems: "center", gap: 12 }}>
        {step > 1 && <button onClick={() => setStep(s => s - 1)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8A7968" }}>←</button>}
        <div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18 }}>{titles[step - 1]}</div>
          <div style={{ fontSize: 12, color: "#8A7968" }}>Step {step} of {STEPS}</div>
        </div>
        <span className={`role-badge ${user.role}`} style={{ marginLeft: "auto" }}>{isOwner ? "🏡 Owner" : "🎒 Buddy"}</span>
      </div>
      <div style={{ padding: "24px 20px" }}>
        <div className="step-bar">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className="step-seg" style={{ flex: i === step - 1 ? 2 : 1, background: i < step ? "#C4622D" : "#F2E4CC" }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 6 }}>Hey {user.name}! 👋</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Let's set up your {isOwner ? "host" : "traveller"} profile.</p>
            {!isOwner && <div className="field"><label>Your age</label><input type="number" placeholder="e.g. 28" value={form.age} onChange={e => set("age", e.target.value)} /></div>}
            <div className="field"><label>City</label><input placeholder="e.g. Amsterdam" value={form.city} onChange={e => set("city", e.target.value)} /></div>
            <div className="field"><label>Country</label><input placeholder="e.g. Netherlands" value={form.country} onChange={e => set("country", e.target.value)} /></div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 6 }}>Tell your story</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>This is what people see on your profile.</p>
            <div className="field">
              <label>Tagline — one catchy line about you</label>
              <input placeholder={isOwner ? "e.g. Cosy rooms, big adventures" : "e.g. Slow travel & strong coffee"} value={form.tagline} onChange={e => set("tagline", e.target.value)} maxLength={60} />
              <div style={{ fontSize: 11, color: "#8A7968", marginTop: 4 }}>{form.tagline.length}/60</div>
            </div>
            <div className="field">
              <label>About you</label>
              <textarea placeholder={isOwner ? "Tell guests about your place…" : "What kind of traveller are you?…"} value={form.bio} onChange={e => set("bio", e.target.value)} rows={5} maxLength={400}
                style={{ width: "100%", padding: "13px 16px", border: "1.5px solid #F2E4CC", borderRadius: 14, background: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none", resize: "none", lineHeight: 1.6 }} />
              <div style={{ fontSize: 11, color: "#8A7968", marginTop: 4 }}>{form.bio.length}/400</div>
            </div>
          </div>
        )}

        {step === 3 && isOwner && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 6 }}>Your property</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Tell guests what you're offering.</p>
            <div className="field"><label>Property name</label><input placeholder="e.g. Casa Sabor" value={form.propertyName} onChange={e => set("propertyName", e.target.value)} /></div>
            <div className="field">
              <label>Property type</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PROPERTY_TYPES.map(t => <button key={t} onClick={() => set("propertyType", t)} style={sb(t, form.propertyType)}>{t}</button>)}
              </div>
            </div>
            <div className="field"><label>Number of rooms</label><input type="number" min="1" placeholder="e.g. 3" value={form.rooms} onChange={e => set("rooms", e.target.value)} /></div>
            <div className="field">
              <label>Price per night (€) — from / to</label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="number" placeholder="From" value={form.priceFrom} onChange={e => set("priceFrom", e.target.value)} style={{ flex: 1 }} />
                <span style={{ color: "#8A7968" }}>–</span>
                <input type="number" placeholder="To" value={form.priceTo} onChange={e => set("priceTo", e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
            <div className="field"><label>House rules (optional)</label><input placeholder="e.g. No smoking, check-in after 15:00" value={form.houseRules} onChange={e => set("houseRules", e.target.value)} /></div>
          </div>
        )}

        {step === 3 && !isOwner && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 6 }}>Travel plans</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Where are you headed?</p>
            <div className="field"><label>Next destination</label><input placeholder="e.g. Lisbon, Portugal" value={form.nextDestination} onChange={e => set("nextDestination", e.target.value)} /></div>
            <div className="field">
              <label>Travel style</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TRAVEL_STYLES.map(t => <button key={t} onClick={() => set("travelStyle", t)} style={sb(t, form.travelStyle)}>{t}</button>)}
              </div>
            </div>
          </div>
        )}

        {step === 4 && isOwner && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 6 }}>Amenities</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>What do you offer guests?</p>
            <MultiSelect options={AMENITIES_LIST} selected={form.amenities} onToggle={v => tog("amenities", v)} />
          </div>
        )}

        {step === 4 && !isOwner && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 6 }}>Your preferences</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Help others understand how you travel.</p>
            <div className="field">
              <label>Trip duration</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {DURATIONS.map(d => <button key={d} onClick={() => set("tripDuration", d)} style={sb(d, form.tripDuration)}>{d}</button>)}
              </div>
            </div>
            <div className="field" style={{ marginTop: 20 }}>
              <label>Budget</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {BUDGETS.map(b => <button key={b} onClick={() => set("budget", b)} style={sb(b, form.budget)}>{b}</button>)}
              </div>
            </div>
            <div className="field" style={{ marginTop: 20 }}>
              <label>Looking for</label>
              <MultiSelect options={LOOKING_FOR} selected={form.lookingFor} onToggle={v => tog("lookingFor", v)} />
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 6 }}>Almost there!</h2>
            <p style={{ fontSize: 14, color: "#8A7968", marginBottom: 24 }}>Add your languages and interests.</p>
            <div className="field"><label>Languages you speak</label><MultiSelect options={LANGUAGES_LIST} selected={form.languages} onToggle={v => tog("languages", v)} /></div>
            <div className="field" style={{ marginTop: 20 }}><label>Interests (pick up to 6)</label><MultiSelect options={INTERESTS_LIST} selected={form.interests} onToggle={v => tog("interests", v)} max={6} /></div>
          </div>
        )}

        {step === 6 && (
          <PhotoStep avatar={form.avatar} photos={form.photos} isOwner={isOwner}
            onAvatar={v => set("avatar", v)} onPhotos={v => set("photos", v)} />
        )}

        <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
          {step > 1 && <button className="btn-ghost" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>← Back</button>}
          {step < STEPS
            ? <button className="btn-main" onClick={() => ok() && setStep(s => s + 1)} style={{ flex: 2, opacity: ok() ? 1 : 0.45 }}>Continue →</button>
            : <button className="btn-main" onClick={() => onDone(form)} style={{ flex: 2 }}>Submit profile 🎉</button>
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
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, marginBottom: 12 }}>You're on your way, {user.name}!</h1>
      <p style={{ fontSize: 15, color: "#8A7968", lineHeight: 1.7, marginBottom: 8 }}>Your profile has been submitted and is currently <strong style={{ color: "#C4622D" }}>under review</strong>.</p>
      <p style={{ fontSize: 14, color: "#8A7968", lineHeight: 1.7, marginBottom: 32 }}>We check every profile to keep BnbBuddy safe and welcoming. You'll receive an email within <strong>24–48 hours</strong>.</p>
      <div className="review-box">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>⏳</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>What happens next</span>
        </div>
        {["Your profile is reviewed by our team", "You get an email once it's approved", "Your profile goes live in the community", "Start connecting with matches!"].map((s, i) => (
          <div className="review-step" key={i}>
            <div className="review-num">{i + 1}</div>
            <span style={{ fontSize: 13, color: "#8A7968", lineHeight: 1.5 }}>{s}</span>
          </div>
        ))}
      </div>
      <button className="btn-main" onClick={onBrowse} style={{ width: "100%" }}>Browse profiles in the meantime →</button>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [screen, setScreen] = useState("browse");
  const [tab, setTab] = useState("browse");
  const [viewProfile, setViewProfile] = useState(null);
  const [chatProfile, setChatProfile] = useState(null);
  const [messages, setMessages] = useState(MESSAGES_INIT);
  const [likes, setLikes] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [dbProfiles, setDbProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // Load approved profiles from Supabase on mount
  useEffect(() => {
    getApprovedProfiles()
      .then(data => {
        if (data && data.length > 0) setDbProfiles(data.map(p => ({
          ...p,
          avatar: p.avatar_url || "https://i.pravatar.cc/400?img=47",
          photos: (p.photos || []).filter(ph => ph.type === "gallery").map(ph => ph.url),
          nextDestination: p.next_destination,
          tripDuration: p.trip_duration,
          lookingFor: Array.isArray(p.looking_for) ? p.looking_for.join(", ") : p.looking_for,
          travelStyle: p.travel_style,
          pricePerNight: p.price_from && p.price_to ? `€${p.price_from}–€${p.price_to}` : "",
          propertyName: p.property_name,
          propertyType: p.property_type,
          hostingSince: p.hosting_since,
        })));
      })
      .catch(() => {}) // fallback to demo profiles on error
      .finally(() => setLoadingProfiles(false));
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

  const profileDone = async (form) => {
    if (user) {
      try {
        await updateProfile(user.id, {
          name: form.name || user.name,
          city: form.city, country: form.country,
          age: form.age ? parseInt(form.age) : null,
          tagline: form.tagline, bio: form.bio,
          languages: form.languages, interests: form.interests,
          travel_style: form.travelStyle,
          next_destination: form.nextDestination,
          trip_duration: form.tripDuration,
          budget: form.budget,
          looking_for: form.lookingFor,
          property_name: form.propertyName,
          property_type: form.propertyType,
          rooms: form.rooms ? parseInt(form.rooms) : null,
          price_from: form.priceFrom ? parseFloat(form.priceFrom) : null,
          price_to: form.priceTo ? parseFloat(form.priceTo) : null,
          amenities: form.amenities,
          house_rules: form.houseRules,
        });
        if (form.avatar) setUser(u => ({ ...u, avatar: form.avatar }));
      } catch (e) { console.error(e); }
    }
    setScreen("under-review");
  };

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

  if (chatProfile && tab === "messages") return (
    <div className="wrap">
      <style>{css}</style>
      <ChatView profile={chatProfile} messages={messages[chatProfile.id] || []} onBack={() => setChatProfile(null)} onSend={send} />
    </div>
  );
  if (screen === "create-profile" && user) return (
    <div className="wrap"><style>{css}</style><CreateProfile user={user} onDone={profileDone} /></div>
  );
  if (screen === "under-review" && user) return (
    <div className="wrap"><style>{css}</style><UnderReview user={user} onBrowse={() => setScreen("browse")} /></div>
  );

  return (
    <div className="wrap">
      <style>{css}</style>

      <div className="nav">
        <div className="nav-logo">bnb<span>buddy</span></div>
        <div className="nav-actions">
          {user ? (
            <>
              <span style={{ fontSize: 13, color: "#8A7968" }}>Hi, {user.name}</span>
              <span className={`role-badge ${user.role}`} style={{ fontSize: 10, padding: "3px 8px" }}>{user.role === "owner" ? "🏡" : "🎒"}</span>
              <button className="btn-nav" onClick={() => setScreen("create-profile")} style={{ fontSize: 12, padding: "5px 10px" }}>+ Profile</button>
              <img src={user.avatar} alt="me" className="nav-avatar" />
            </>
          ) : (
            <>
              <button className="btn-nav" onClick={() => setShowAuth(true)}>Log in</button>
              <button className="btn-nav primary" onClick={() => setShowAuth(true)}>Join free</button>
            </>
          )}
        </div>
      </div>

      <div className="main-content">
        {viewProfile ? (
          <FullProfile profile={viewProfile} onBack={() => setViewProfile(null)} onChat={openChat}
            isLoggedIn={!!user} onLogin={() => { setViewProfile(null); setShowAuth(true); }} />
        ) : tab === "browse" ? (
          <>
            {!user && (
              <div className="hero">
                <h1>Find your <em>travel</em> companion</h1>
                <p>Connect with BnB owners and fellow travelers who match your style and destination.</p>
                <button className="btn-hero" onClick={() => setShowAuth(true)}>Start matching ✈</button>
              </div>
            )}
            <div className="sec-head">
              <h2>Explore profiles</h2>
              <span style={{ fontSize: 12, color: "#8A7968" }}>{filtered.length} found</span>
            </div>
            <div className="filter-pills">
              <button className={`pill ${roleFilter === "all" ? "active" : ""}`} onClick={() => setRoleFilter("all")}>🌍 Everyone</button>
              <button className={`pill ${roleFilter === "owner" ? "active" : ""}`} onClick={() => setRoleFilter("owner")}>🏡 BnB Owners</button>
              <button className={`pill ${roleFilter === "buddy" ? "active" : ""}`} onClick={() => setRoleFilter("buddy")}>🎒 Buddies</button>
            </div>
            <div className="profile-grid">
              {filtered.map(p => (
                <ProfileCard key={p.id} profile={p} isLoggedIn={!!user} onView={setViewProfile} onLogin={() => setShowAuth(true)} />
              ))}
            </div>
            {!filtered.length && <div className="empty"><div className="ei">🔍</div><h3>No profiles found</h3><p>Try a different filter.</p></div>}
          </>
        ) : (
          <>
            <div className="sec-head"><h2>Your matches</h2></div>
            <MatchesTab matches={matched} onOpenChat={p => { setChatProfile(p); setTab("messages"); }} />
          </>
        )}
      </div>

      {user && (
        <div className="bottom-tab">
          <button className={`tab-btn ${tab === "browse" ? "active" : ""}`} onClick={() => { setTab("browse"); setScreen("browse"); }}>
            <span className="tab-icon">🗺</span>Explore
          </button>
          <button className={`tab-btn ${tab === "messages" ? "active" : ""}`} onClick={() => setTab("messages")}>
            <span className="tab-icon">💬</span>Matches
          </button>
          <button className={`tab-btn ${screen === "create-profile" ? "active" : ""}`} onClick={() => setScreen("create-profile")}>
            <span className="tab-icon">👤</span>My Profile
          </button>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={login} />}
    </div>
  );
}
