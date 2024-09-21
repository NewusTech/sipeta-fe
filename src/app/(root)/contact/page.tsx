export default function ContactPage() {
  return (
    <section className="container mx-auto py-10 space-y-6">
      <h1 className="text-primaryy font-semibold text-3xl">Kontak</h1>

      <div className="space-y-1">
        <div className="flex space-x-4">
          <p className="font-medium w-28">Lokasi</p>
          <div className="flex space-x-1">
            <p>:</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste
              tempore inventore blanditiis magnam laboriosam molestiae a,
              laborum quod iure. Minus praesentium cumque maiores neque, officia
              similique provident aliquid voluptates accusamus.
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <p className="font-medium w-[70px]">Email</p>
          <div className="flex space-x-1">
            <p>:</p>
            <p>sipeta@gmail.com</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <p className="font-medium w-[70px]">Telepon </p>
          <div className="flex space-x-1">
            <p>:</p>
            <p>+62 812-3456-7890</p>
          </div>
        </div>
      </div>

      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63611.43474092534!2d104.8549811486088!3d-4.818976760002244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e38a8c34478c437%3A0xf70e2cc30246368!2sKotabumi%2C%20North%20Lampung%20Regency%2C%20Lampung!5e0!3m2!1sen!2sid!4v1726821963937!5m2!1sen!2sid"
          className="w-full h-[40vh]"
          // style="border:0px;"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}