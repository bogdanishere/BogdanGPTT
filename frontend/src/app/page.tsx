import FormChat from "@/components/FormChat";

export default function Home() {
  return (
    <div className="bg-[#e4d4b8] p-8 rounded-lg shadow-lg max-w-4xl w-full">
      <h1 className="text-2xl font-bold text-center mb-6 text-black">
        Chat with BogdanGPT
      </h1>
      <FormChat />
    </div>
  );
}
