import { supabaseAdmin } from "../lib/supabase";

// Mevcut müşterilere referans kodları oluştur
const generateReferralCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

async function updateReferralCodes() {
  try {
    console.log("Mevcut müşteriler alınıyor...");

    // Referans kodu olmayan müşterileri getir
    const { data: customers, error: fetchError } = await supabaseAdmin
      .from("customers")
      .select("id, firstname, lastname")
      .is("myReferralCode", null);

    if (fetchError) {
      console.error("Müşteriler getirilemedi:", fetchError);
      return;
    }

    if (!customers || customers.length === 0) {
      console.log("Referans kodu olmayan müşteri bulunamadı.");
      return;
    }

    console.log(
      `${customers.length} müşteri için referans kodları oluşturuluyor...`
    );

    for (const customer of customers) {
      let myReferralCode = generateReferralCode();

      // Benzersizlik kontrolü
      let attempts = 0;
      while (attempts < 10) {
        const { data: existing } = await supabaseAdmin
          .from("customers")
          .select("myReferralCode")
          .eq("myReferralCode", myReferralCode)
          .single();

        if (!existing) break;

        myReferralCode = generateReferralCode();
        attempts++;
      }

      if (attempts >= 10) {
        console.error(
          `${customer.firstname} ${customer.lastname} için benzersiz kod oluşturulamadı`
        );
        continue;
      }

      // Müşteriyi güncelle
      const { error: updateError } = await supabaseAdmin
        .from("customers")
        .update({
          myReferralCode,
          referralCount: 0,
          totalEarnings: 0,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", customer.id);

      if (updateError) {
        console.error(
          `${customer.firstname} ${customer.lastname} güncellenemedi:`,
          updateError
        );
      } else {
        console.log(
          `✓ ${customer.firstname} ${customer.lastname} - Kod: ${myReferralCode}`
        );
      }
    }

    console.log("Referans kodları başarıyla oluşturuldu!");
  } catch (error) {
    console.error("Script hatası:", error);
  }
}

updateReferralCodes();
