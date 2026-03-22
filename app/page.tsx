import { LoaderFourDemo } from "@/components/ui/loader-four";
import StaggeredMenu from "@/components/ui/StaggeredMenu";
import ASCIIText from "@/components/ui/ASCIIText";

const menuItems = [
  { label: "Inicio", ariaLabel: "Ir al inicio", link: "/" },
  { label: "Registro", ariaLabel: "Ir a registro", link: "/registro" },
  { label: "Hackathon", ariaLabel: "Ver la hackathon", link: "/hackathon" },
  { label: "Charlas", ariaLabel: "Ver charlas", link: "/charlas" },
  { label: "Talleres", ariaLabel: "Ver talleres", link: "/talleres" },
  { label: "Nosotros", ariaLabel: "Conoce al equipo", link: "/nosotros" },
  { label: "FAQ", ariaLabel: "Preguntas frecuentes", link: "/faq" },
];

const socialItems = [
  { label: "Instagram", link: "https://www.instagram.com/sudo_fciencias/" },
  { label: "LinkedIn", link: "https://www.linkedin.com/company/sudo-fciencias/" },
];

export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#000",
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    >
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering
        menuButtonColor="#ffffff"
        openMenuButtonColor="#000"
        changeMenuColorOnOpen
        colors={["#26D968", "#000000"]}
        logoUrl="/logo.svg"
        accentColor="#26D968"
        isFixed
      />
      {/* Hero section with ASCII text */}
      <div style={{ position: "relative", width: "100%", height: "100vh" }}>
        <ASCIIText text="[1]" enableWaves={false} asciiFontSize={8} />
      </div>
      <LoaderFourDemo />
    </main>
  );
}
