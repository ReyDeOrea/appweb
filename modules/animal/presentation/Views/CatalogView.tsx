"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getPetsUseCase } from "@/modules/animal/application/getPets";
import { Pet } from "@/modules/animal/domain/pet";
import { FilterModal, Filters } from "@/modules/animal/presentation/components/FilterModal";
import { ModalMenu } from "@/modules/user/presentation/components/modalMenu";

const CARD_WIDTH = 180;
const IMAGE_SIZE = 150;
const BANNER_HEIGHT = 250;

const supabaseLoader = ({ src, width }: { src: string; width: number }) => {
  return `${src}?w=${width}`;
};

type BannerItem = {
  type: "static" | "adopted";
  image: string;
  name?: string;
};

export default function CatalogView() {
  const router = useRouter();

  const [pets, setPets] = useState<Pet[]>([]);
  const [filters, setFilters] = useState<Filters>({
    type: [],
    sex: [],
    size: [],
    adopted: false,
  });
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const data = await getPetsUseCase();
        setPets(data);
      } catch (err) {
        console.error("ERROR fetching pets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  const adoptedPets = pets.filter(p => p.adopted);
  const staticBanners: BannerItem[] = [
    { type: "static", image: "/images/D.png" },
    { type: "static", image: "/images/Cat.jpeg" },
    { type: "static", image: "/images/DOG.png" },
  ];

  const adoptedBanners: BannerItem[] = adoptedPets.map(p => {
    let firstImage = "";
    try {
      const arr = typeof p.image_url === "string" ? JSON.parse(p.image_url) : p.image_url;
      firstImage = Array.isArray(arr) ? arr[0] : p.image_url || "";
    } catch {
      firstImage = p.image_url || "";
    }
    return { type: "adopted", image: firstImage, name: p.name };
  });

  const bannerImages: BannerItem[] = [...staticBanners, ...adoptedBanners];

  const filteredPets = useMemo(() => {
    return pets.filter(p => {
      const term = search.toLowerCase();

      if (search) {
        if (
          !p.name?.toLowerCase().includes(term) &&
          !String(p.type ?? "").toLowerCase().includes(term) &&
          !String(p.sex ?? "").toLowerCase().includes(term) &&
          !String(p.size ?? "").toLowerCase().includes(term) &&
          !String(p.age ?? "").toLowerCase().includes(term)
        )
          return false;
      }

      if (filters.adopted && !p.adopted) return false;
      if (!filters.adopted && p.adopted) return false;
      if (filters.type.length && !filters.type.map(f => f.toLowerCase()).includes((p.type ?? "").toLowerCase())) return false;
      if (filters.sex.length && !filters.sex.map(f => f.toLowerCase()).includes((p.sex ?? "").toLowerCase())) return false;
      if (filters.size.length && !filters.size.map(f => f.toLowerCase()).includes((p.size ?? "").toLowerCase())) return false;

      return true;
    });
  }, [pets, search, filters]);

  const chunks: Pet[][] = [];
  for (let i = 0; i < filteredPets.length; i += 3) {
    chunks.push(filteredPets.slice(i, i + 3));
  }

  const renderPet = (pet: Pet) => {
    const isAdopted = pet.adopted;

    let images: string[] = [];
    try {
      if (typeof pet.image_url === "string") {
        images = JSON.parse(pet.image_url);
        if (!Array.isArray(images)) images = [pet.image_url];
      } else if (Array.isArray(pet.image_url)) {
        images = pet.image_url;
      } else {
        images = [];
      }
    } catch {
      images = pet.image_url ? [pet.image_url] : [];
    }

    return (
      <div
        key={pet.id}
        className={`w-[180px] p-2 rounded-2xl text-center cursor-pointer relative transition-transform hover:scale-105 ${
          isAdopted ? "bg-gray-200" : "bg-gray-300 hover:bg-gray-400"
        }`}
        onClick={() =>
          router.push(`/pet/profileanimal?pet=${encodeURIComponent(JSON.stringify(pet))}`)
        }
      >
        {images[0] && (
          <Image
            loader={supabaseLoader}
            src={images[0]}
            alt={pet.name || "Pet"}
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            style={{
              objectFit: "cover",
              borderRadius: 20,
              width: "100%",
              height: "auto",
              aspectRatio: 1,
              opacity: isAdopted ? 0.4 : 1,
            }}
          />
        )}
        <div className="font-bold mt-2">{pet.name}</div>
        <div className="text-sm">{pet.sex}</div>
        <div className="text-sm">{pet.size}</div>

        {isAdopted && (
          <div className="absolute top-1 left-1 bg-yellow-400 px-2 py-1 rounded-lg text-xs font-bold">
            ¡{pet.name} ha sido adoptado!
          </div>
        )}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        Cargando...
      </div>
    );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center bg-yellow-400 p-4 rounded-lg mb-4">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          Animaland <span>🐶</span>
        </h2>
        <button onClick={() => setModalOpen(true)}>☰</button>
      </div>

      <div className="flex items-center border border-yellow-200 rounded-lg p-2 mb-4 bg-yellow-50">
        <input
          type="text"
          placeholder="Buscar por nombre, tipo, sexo o tamaño"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 h-10 px-2 outline-none bg-transparent"
        />
        <button className="mx-2">🔍</button>
        <button onClick={() => setFilterOpen(true)}>⚙️</button>
      </div>

      <div className="flex overflow-x-scroll gap-3 mb-4">
        {bannerImages.map((item, idx) => (
          <div key={idx} className="min-w-[300px] relative rounded-2xl overflow-hidden">
            <Image
              loader={supabaseLoader}
              src={item.image}
              alt={item.name || "banner"}
              width={300}
              height={BANNER_HEIGHT}
              style={{ objectFit: "cover", borderRadius: 20 }}
            />
            {item.type === "adopted" && (
              <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                ¡ {item.name} ahora tiene una familia! 🐾
              </div>
            )}
          </div>
        ))}
      </div>

      {chunks.map((row, idx) => (
        <div key={idx} className="flex justify-around mb-4">
          {row.map(renderPet)}
        </div>
      ))}

      <ModalMenu
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        user={user}
        setUser={setUser}
      />
      <FilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}