import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center brightness-75 blur-sm z-0"
        style={{ backgroundImage: "url('/lego_banner.jpg')" }}
      />

      <div className="relative z-10">
        <Navbar />
        <section className="flex flex-col items-center justify-center text-center py-20 px-4 min-h-[calc(100vh-64px)] text-white">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 drop-shadow-md text-black"
            style={{
              textShadow: '0 0 10px #ffffff, 0 0 20px #ffcc00, 0 0 30px #ffcc00'
            }}
          >
            Selamat Datang di LEGO Parts Store
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 max-w-xl text-white/90 drop-shadow">
            Temukan berbagai part LEGO untuk melengkapi koleksi kamu!
            <br />
            <span className="font-semibold">Login</span> untuk melihat dashboard dan kelola produk.
          </p>

          <a
            href="/signin"
            className="text-base sm:text-lg bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition font-semibold drop-shadow"
          >
            Login Sekarang
          </a>
        </section>
      </div>
    </main>
  );
}
