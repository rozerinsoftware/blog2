require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Environment dosyasından oku
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ HATA: Supabase bilgileri bulunamadı!');
  console.log('1. .env.local dosyasının blog2 klasöründe olduğundan emin olun');
  console.log('2. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY değerlerinin doğru olduğunu kontrol edin');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  try {
    console.log('🔧 Admin kullanıcısı oluşturuluyor...');
    console.log('Email: admin@example.com');
    console.log('Şifre: 123456');
    
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: '123456',
      options: {
        data: {
          role: 'admin'
        }
      }
    });

    if (error) {
      console.error('❌ Hata:', error.message);
      if (error.message.includes('already registered')) {
        console.log('💡 Bu email zaten kayıtlı. Giriş yapmayı deneyin.');
      }
      return;
    }

    console.log('✅ Admin kullanıcısı başarıyla oluşturuldu!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Şifre: 123456');
    console.log('🆔 Kullanıcı ID:', data.user.id);
    console.log('');
    console.log('🎉 Artık admin@example.com ile giriş yapabilirsiniz!');
    
  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error);
  }
}

createAdminUser();
