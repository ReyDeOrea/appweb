"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getPetsUseCase } from "@/modules/animal/application/getPets";
import { Pet } from "@/modules/animal/domain/pet";
import { FilterModal, Filters } from "@/modules/animal/presentation/components/FilterModal";
import { ModalMenu } from "@/modules/user/presentation/components/modalMenu";
import { FaDog, FaPaw } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";

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
    { type: "static", image: "/images/B1.png" },
  ];

const adoptedBanners: BannerItem[] = (() => {
  if (adoptedPets.length === 0) return [];

  const shuffled = [...adoptedPets].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  return selected.map(p => {
    let firstImage = "";
    try {
      const arr =
        typeof p.image_url === "string"
          ? JSON.parse(p.image_url)
          : p.image_url;
      firstImage = Array.isArray(arr) ? arr[0] : p.image_url || "";
    } catch {
      firstImage = p.image_url || "";
    }
    return { type: "adopted", image: firstImage, name: p.name };
  });
})();

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
      if (
        filters.type.length &&
        !filters.type.map(f => f.toLowerCase()).includes((p.type ?? "").toLowerCase())
      )
        return false;
      if (
        filters.sex.length &&
        !filters.sex.map(f => f.toLowerCase()).includes((p.sex ?? "").toLowerCase())
      )
        return false;
      if (
        filters.size.length &&
        !filters.size.map(f => f.toLowerCase()).includes((p.size ?? "").toLowerCase())
      )
        return false;

      return true;
    });
  }, [pets, search, filters]);

  const chunks: Pet[][] = [];
  for (let i = 0; i < filteredPets.length; i += 6) {
    chunks.push(filteredPets.slice(i, i + 6));
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
      }
    } catch {
      images = pet.image_url ? [pet.image_url] : [];
    }

   return (
      <div
        key={pet.id}
        className={`w-[220px] p-3 rounded-[15px] text-center cursor-pointer relative transition-all duration-300 hover:scale-105 shadow-md 
        ${isAdopted ? "bg-[#F5F5F5] hover:bg-[#E0E0E0]" : "bg-[#EAEAEA] hover:bg-[#D9D9D9]"}
        flex-shrink-0 mx-2`}
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
              borderRadius: 15,
              width: "100%",
              aspectRatio: 1,
              opacity: isAdopted ? 0.4 : 1,
            }}
          />
        )}

        <div className="font-semibold mt-2 text-[#333] text-base">{pet.name}</div>
        <div className="text-sm text-[#666]">{pet.sex}</div>
        <div className="text-sm text-[#666]">{pet.size}</div>

        {isAdopted && (
          <div className="absolute top-1 left-1 bg-[#FFD700] px-2 py-1 rounded-full text-[10px] font-bold text-black">
            ¡{pet.name} ha sido adoptado!
          </div>
        )}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#FDF8F0]">
        <p className="text-[#B7C979] text-xl font-semibold">Cargando...</p>
      </div>
    );

  return (
 <div className="min-h-screen bg-[#FDF8F0] p-4 md:p-6 ml-[200px]">

    <ModalMenu
      user={user}
      setUser={setUser}
    />

    <div className="flex-1 w-full p-4 md:p-6">
     
     <div className="bg-[#B7C979] w-full p-4 mb-6 flex items-center justify-between rounded-xl">
       <h2 className="text-white text-2xl font-bold flex items-center gap-2">
       Animaland
       <FaPaw className="text-white text-3xl" />
  </h2>
      </div>

      <div className="bg-[#E5DCCC] rounded-xl p-2 mb-6 flex items-center border border-[#7E6950]">
         <button className="text-[#5B4000] px-4 py-2 hover:bg-[#D9C9A3] rounded-lg transition-colors">
       <IoIosSearch className="text-3xl"/>
        </button>
        <input
          type="text"
          placeholder="Buscar mascotas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2 outline-none text-[#333] placeholder:text-[#7E6950]"
        />
       
        <button 
          onClick={() => setFilterOpen(true)} 
          className="text-[#D09100] px-4 py-2 hover:bg-[#D9C9A3] rounded-lg transition-colors ml-2"
        >
         <IoFilterOutline className="text-3xl"/>
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-[#7E6950] font-semibold mb-3 text-lg">🌟 Destacados</h3>
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {bannerImages.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 relative rounded-2xl overflow-hidden shadow-lg bg-[#FFF8E7] border border-[#D9C9A3]"
              style={{ width: 300, height: BANNER_HEIGHT }}
            >
              <Image
                loader={supabaseLoader}
                src={item.image}
                alt="banner"
                width={300}
                height={BANNER_HEIGHT}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />

              {item.type === "adopted" && (
                <div className="absolute bottom-2 right-2 bg-[#22c55e] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  🏠 ¡{item.name} ha sido adoptado!
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-3">
          {bannerImages.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full mx-1 ${
                idx === 0 ? "bg-[#D09100]" : "bg-[#ccc]"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[#7E6950] font-semibold mb-3 text-lg">
          🐾 Mascotas disponibles ({filteredPets.length})
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide">
          {filteredPets.length > 0 ? (
            filteredPets.map(renderPet)
          ) : (
            <div className="w-full text-center py-10 text-[#7E6950]">
              No se encontraron mascotas
            </div>
          )}
        </div>
      </div>

      <FilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
      </div>
  );
}