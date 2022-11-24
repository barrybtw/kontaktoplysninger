import { invoke } from "@tauri-apps/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const schema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().regex(/^[0-9]{8}$/, "Ugyldig telefonnummer"),
  email: z.string().email("Ugyldig email"),
  file_path: z.string().trim().min(1),
});

type Inputs = z.infer<typeof schema>;

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });
  const [status, setStatus] = useState("");
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    let status = await invoke("makefile", {
      filename: `${data.file_path}.txt`,
      username: data.name,
      phone: data.phone,
      email: data.email,
    });

    const safe = z.string().parse(status);

    setStatus(safe);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("");
    }, 10000);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-t from-gray-800 to-gray-900 text-yellow-50">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex justify-between gap-4">
          <label htmlFor="name">Navn</label>
          <div className="flex flex-col relative">
            <input
              type="text"
              {...register("name", { required: true })}
              className="form-control text-gray-900 rounded-sm p-[1px] "
              id="name"
              placeholder="Navn"
            />
            {errors.name && (
              <span className="error absolute top-6">Navn er påkrevet</span>
            )}
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <label htmlFor="phone">Telefon</label>
          <div className="flex flex-col relative">
            <input
              type="text"
              {...register("phone", { required: true })}
              className="form-control text-gray-900 rounded-sm p-[1px] "
              id="phone"
              placeholder="Telefon"
            />
            {errors.phone && (
              <span className="error absolute top-6">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <label htmlFor="email">Email</label>
          <div className="flex flex-col relative">
            <input
              type="text"
              {...register("email", { required: true })}
              className="form-control text-gray-900 rounded-sm p-[1px] "
              id="email"
              placeholder="Email"
            />
            {errors.email && (
              <span className="error absolute top-6">
                {errors.email.message}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <label htmlFor="file_path">Filnavn</label>
          <div className="flex flex-col relative">
            <input
              type="text"
              {...register("file_path", { required: true })}
              className="form-control text-gray-900 rounded-sm p-[1px] "
              id="file_path"
              placeholder="Fil"
            />
            {errors.file_path && (
              <span className="error absolute top-6">Filnavn er påkrevet</span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-slate-500 rounded-md w-24 self-center border-gray-800 font-bold"
        >
          Lav fil
        </button>
        {status.length > 0 ? (
          <div className="self-center text-green-300">
            <p>{status} oprettet!</p>
          </div>
        ) : null}
      </form>
    </div>
  );
}

export default App;
