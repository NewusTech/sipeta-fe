export default function InstructionsForUsePage() {
  return (
    <section className="container mx-auto py-10">
      <div className="grid grid-cols-3 gap-x-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="w-full h-[462px] bg-greyy flex justify-center items-center">
            <h1>FILE PETUNJUK PENGGUNAAN SURVEYOR</h1>
          </div>
        ))}
      </div>
    </section>
  );
}
