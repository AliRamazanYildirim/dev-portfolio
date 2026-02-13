import { customerRepository } from "../lib/repositories";

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

    // Referans kodu olmayan müşterileri getir (Prisma)
    const customers = await customerRepository.findMany({ where: { myReferralCode: null }, select: { id: true, firstname: true, lastname: true } });
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
        const existing = await customerRepository.findUnique({ where: { myReferralCode } });
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
      try {
        await customerRepository.update({ where: { id: customer.id }, data: { myReferralCode, referralCount: 0, totalEarnings: 0, updatedAt: new Date() } });
        console.log(`✓ ${customer.firstname} ${customer.lastname} - Kod: ${myReferralCode}`);
      } catch (e) {
        console.error(`${customer.firstname} ${customer.lastname} güncellenemedi:`, e);
      }
    }

    console.log("Referans kodları başarıyla oluşturuldu!");
  } catch (error) {
    console.error("Script hatası:", error);
  }
}

updateReferralCodes();
