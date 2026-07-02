// Bulk Vendor Upload Script for SolargyAfrica
// Run with: node upload-vendors.js

const API_URL = "https://solar-africa.onrender.com";
const ADMIN_KEY = "solargy-admin-2024";

const vendors = [
  {
    name: "SOLAR WORLD ELECTRIC TECHNOLOGY",
    category: "Solar Installer",
    state: "Lagos",
    city: "Lekki Phase 1",
    phone: "+2349063315492",
    whatsapp: "+2349063315492",
    services: "Renewable Energy",
    description:
      "Switch to Solar Sustainable & Reliable Energy. Our advanced energy storage solutions allow you to store excess energy generated from renewable sources like solar and wind. This enables a constant, uninterrupted power supply, providing energy independence.",
  },
  {
    name: "SOLAR WORLD ELECTRIC TECHNOLOGY",
    category: "Solar Installer",
    state: "Rivers",
    city: "Port Harcourt",
    phone: "09037933268",
    whatsapp: "09037933268",
    services: "Renewable Energy",
    description:
      "Switch to Solar Sustainable & Reliable Energy. Our advanced energy storage solutions allow you to store excess energy generated from renewable sources like solar and wind. This enables a constant, uninterrupted power supply, providing energy independence.",
  },
  {
    name: "SOLAR WORLD ELECTRIC TECHNOLOGY",
    category: "Solar Installer",
    state: "Abuja",
    city: "Wuse 2",
    phone: "08081567225",
    whatsapp: "08081567225",
    services: "Renewable Energy",
    description:
      "Switch to Solar Sustainable & Reliable Energy. Our advanced energy storage solutions allow you to store excess energy generated from renewable sources like solar and wind. This enables a constant, uninterrupted power supply, providing energy independence.",
  },
  {
    name: "Mido Technology",
    category: "Solar Installer",
    state: "Lagos",
    city: "Ikeja",
    phone: "07061259259",
    whatsapp: "07061259259",
    services: "Renewable Energy",
    description:
      "On a mission to help potential customers make transition to cost friendly solar electricity.",
  },
  {
    name: "SOLARITY",
    category: "Solar Home Systems",
    state: "Lagos",
    city: "Somolu",
    phone: "+2349053902950",
    whatsapp: "09053902950",
    services: "Renewable Energy",
    description:
      "Solarity is the flagship brand for Solar Home Systems, dedicated to providing solar energy solutions across Nigeria. We design, distribute, install, and finance systems for the millions of Nigerians who lack reliable access to or cannot afford traditional electrical grid connections.",
  },
  {
    name: "MCORTECH SOLAR",
    category: "Solar Installer",
    state: "Lagos",
    city: "Ikeja",
    phone: "09065199689",
    whatsapp: "09065199689",
    services: "Solar Engineering",
    description:
      "Nationwide Solar Engineering. Professional solar installation for homes, offices, churches and factories across Nigeria.",
  },
  {
    name: "Wavetra Energy",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Ikeja",
    phone: "08157171707",
    whatsapp: "08157171707",
    services: "Renewable Energy",
    description:
      "We also run Wavetra Energy Academy which is Nigeria's number one solar training institute. We partner with state and private agencies to provide solar power solutions and training programs for skill acquisition and youth empowerment.",
  },
  {
    name: "NSC Meskana Global Co. Ltd",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Ojo",
    phone: "08146901808",
    whatsapp: "09120837567",
    services: "Renewable Energy",
    description:
      "NSC Meskana Global Co. Ltd is a leading supplier based in Alaba International Market, Lagos, offering quality furniture, modern lighting, and durable solar energy solutions. We specialize in home and office furniture, LED lighting, and off-grid solar power systems tailored for both residential and commercial use.",
  },
  {
    name: "Dando Solar",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Okota",
    phone: "08066592828",
    whatsapp: "08066592828",
    services: "Solar Energy Company",
    description:
      "Offering solution to power failure. Renewable energy solar installation.",
  },
  {
    name: "VGL Energy",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Surulere",
    phone: "08027571553",
    whatsapp: "08027571553",
    services: "Solar Company",
    description:
      "VGL Energy is a sustainable energy provider in Nigeria that designs, assembles, installs and promotes solar energy and energy saving technology. We develop and install solar systems for both domestic and commercial needs with extensive expertise in providing power.",
  },
  {
    name: "Solar Empire",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Ojo",
    phone: "07059569110",
    whatsapp: "07059569110",
    services: "Renewable Energy",
    description:
      "Our technical team at Solar Empire West Africa Ltd consists of highly skilled and certified professionals with extensive experience in solar energy systems. They are experts in the design, installation, and maintenance of solar PV systems.",
  },
  {
    name: "SELENIUM SOLAR",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Surulere",
    phone: "08181287661",
    whatsapp: "08181287661",
    services: "Solar Solutions",
    description:
      "Powering your home and business with clean, reliable solar energy.",
  },
  {
    name: "Haviskye Merchandise",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Ikeja",
    phone: "08024042098",
    whatsapp: "08024042098",
    services: "Solar Products",
    description:
      "Our drive is based upon the idea of being the light to Nigerians and the world. By subscribing to Haviskye solar solution, you're also reducing the Co2 emission in our air, which goes along with the climate change resolution.",
  },
  {
    name: "FAJMAL ELECTRICAL",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Palmgrove",
    phone: "07036043069",
    whatsapp: "09049739901",
    services: "Delivering Reliable Power",
    description:
      "Powering a Smarter Future with Electrical, Solar & CCTV Solutions. With over a decade of experience, we deliver reliable, safe, and modern solutions designed to power, protect, and enhance homes and businesses across Nigeria.",
  },
  {
    name: "Optimal Techie",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Ikeja",
    phone: "09029795876",
    whatsapp: "09029795876",
    services: "Innovation and Sustainability",
    description:
      "At Optimal Techie, we power possibilities. We are a trusted retailer and distributor of premium electrical materials, solar systems, inverters, cables, and electrical appliances, committed to bringing reliable and energy-efficient solutions to homes and businesses across Nigeria.",
  },
  {
    name: "StarTimes Solar",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Ikeja",
    phone: "08138135503",
    whatsapp: "08172397969",
    services: "Solar Today",
    description:
      "Are you tired of energy blackouts and expensive generators? StarTimes Solar Inverters connect to two sources of electricity: solar panels and the electrical grid, to provide homes and businesses with seamless, clean, and affordable energy around the clock.",
  },
  {
    name: "ME.3 Energy Ltd",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Victoria Island",
    phone: "07061235392",
    whatsapp: "07061235392",
    services: "Renewable Energy",
    description:
      "ME.3 Energy Ltd is a Leading Principal Trader and Direct Major Distributor of a wide range of Renewable Energy, Power Protection, Power Conversion, Power Distribution, Electrical Accessories & Cables, and Consumer Electronics products in Nigeria.",
  },
  {
    name: "Arnergy",
    category: "Solar Consultant",
    state: "Lagos",
    city: "Ilupeju",
    phone: "07002288888",
    whatsapp: "09120387551",
    services: "Reliable systems, lower bills, and long-term value",
    description:
      "Arnergy is a renewable energy company providing modular, scalable solar solutions for homes and businesses, improving energy reliability and digital inclusion across Africa with our proprietary real-time energy management system.",
  },
];

async function uploadVendor(vendor, index) {
  try {
    const response = await fetch(`${API_URL}/api/vendors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vendor),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(
        `✅ [${index + 1}/${vendors.length}] Uploaded: ${vendor.name} (${vendor.city})`,
      );
      return data.id;
    } else {
      const err = await response.text();
      console.log(
        `❌ [${index + 1}/${vendors.length}] Failed: ${vendor.name} — ${err}`,
      );
      return null;
    }
  } catch (err) {
    console.log(
      `❌ [${index + 1}/${vendors.length}] Error: ${vendor.name} — ${err.message}`,
    );
    return null;
  }
}

async function verifyVendor(id, name) {
  try {
    const response = await fetch(`${API_URL}/api/admin/vendors/${id}/verify`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_KEY,
      },
    });
    if (response.ok) {
      console.log(`✅ Verified: ${name}`);
    } else {
      console.log(`❌ Verify failed: ${name}`);
    }
  } catch (err) {
    console.log(`❌ Verify error: ${name} — ${err.message}`);
  }
}

async function main() {
  console.log(`\n🚀 Starting bulk upload of ${vendors.length} vendors...\n`);

  const ids = [];
  for (let i = 0; i < vendors.length; i++) {
    const id = await uploadVendor(vendors[i], i);
    if (id) ids.push({ id, name: vendors[i].name });
    await new Promise((r) => setTimeout(r, 500)); // 500ms delay between requests
  }

  console.log(
    `\n✅ Upload complete! ${ids.length}/${vendors.length} vendors uploaded.`,
  );
  console.log(`\n🔄 Now verifying all uploaded vendors...\n`);

  for (const { id, name } of ids) {
    await verifyVendor(id, name);
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n🎉 Done! All vendors are now live on SolargyAfrica.`);
}

main();
