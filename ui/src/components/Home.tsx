import { useState, useEffect, type ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

const SLIDE_CONTENT = {
  slide1: {
    titlePrefix: "Understanding the ",
    titleHighlight: "OSI Model",
    description:
      "A conceptual framework standardizing telecommunication and computing system functions into seven distinct layers.",
  },
  slide2: {
    titlePrefix: "The Value of ",
    titleHighlight: "Abstraction",
    image: { src: "/osi.jpg", alt: "OSI network stack diagram" },
    paragraphs: [
      <span key="p1">
        The OSI model provides a universal language for computer networking. By
        abstracting the complex process of network communication into discrete
        layers, it guarantees interoperability between diverse{" "}
        <strong className="text-slate-900">hardware and software</strong>{" "}
        systems.
      </span>,
      "Each layer serves the layer directly above it and is served by the layer below it. This strict separation of concerns simplifies troubleshooting; engineers can isolate network failures to a specific functional layer without reverse-engineering the entire stack.",
      "Data moves down the stack on the transmitting host, undergoing encapsulation, and travels up the stack on the receiving host via decapsulation.",
    ],
  },
  slide3: {
    title: "The Seven Layers",
    headers: ["Layer", "Protocol Data Unit (PDU)", "Primary Function"],
    rows: [
      {
        layer: "7. Application",
        threat: "Data",
        control: "High-level APIs, resource sharing, and remote access.",
      },
      {
        layer: "6. Presentation",
        threat: "Data",
        control: "Translation, encryption, and compression of payload data.",
      },
      {
        layer: "5. Session",
        threat: "Data",
        control:
          "Establishing, managing, and terminating communication sessions.",
      },
      {
        layer: "4. Transport",
        threat: "Segment / Datagram",
        control:
          "Reliable end-to-end data transfer, error recovery, and flow control.",
      },
      {
        layer: "3. Network",
        threat: "Packet",
        control:
          "Logical IP addressing, routing, and optimal path determination.",
      },
      {
        layer: "2. Data Link",
        threat: "Frame",
        control:
          "Physical MAC addressing, node-to-node transfer, and error detection.",
      },
      {
        layer: "1. Physical",
        threat: "Bit",
        control:
          "Transmission and reception of raw bitstreams over a physical medium.",
      },
    ],
  },
  slide4: {
    title: "Architectural Domains",
    domains: [
      {
        titlePrefix: "Host Layers ",
        titleHighlight: "(5-7)",
        description:
          "Implemented almost entirely in software. These upper layers are oblivious to the network's physical topology. They handle application-level logic, data formatting, and continuous connection state between end-user applications.",
      },
      {
        titlePrefix: "Media & Transport Layers ",
        titleHighlight: "(1-4)",
        description:
          "Implemented in a combination of hardware and the operating system's network stack. These lower layers manage the mechanical delivery of bits, dealing with routing, segmentation, addressing, and hardware signaling.",
      },
    ],
  },
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides: ReactNode[] = [
    // SLIDE 1
    <div
      key="slide-1"
      className="flex h-full flex-col items-center justify-center bg-linear-to-b from-white to-slate-50 p-12 text-center"
    >
      <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 md:text-7xl">
        {SLIDE_CONTENT.slide1.titlePrefix}
        <span className="text-blue-700">
          {SLIDE_CONTENT.slide1.titleHighlight}
        </span>
      </h1>
      <p className="max-w-3xl text-xl leading-relaxed text-slate-500 md:text-2xl">
        {SLIDE_CONTENT.slide1.description}
      </p>
    </div>,

    // SLIDE 2
    <div
      key="slide-2"
      className="grid h-full grid-cols-1 bg-white md:grid-cols-2"
    >
      <div className="flex flex-col justify-center p-10 md:p-16">
        <h2 className="mb-8 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          {SLIDE_CONTENT.slide2.titlePrefix}
          <span className="text-blue-700">
            {SLIDE_CONTENT.slide2.titleHighlight}
          </span>
        </h2>
        <div className="space-y-6 text-lg leading-relaxed text-slate-600">
          {SLIDE_CONTENT.slide2.paragraphs.map((paragraph, idx) => (
            <p key={`s2-p-${idx}`}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div className="hidden h-full w-full overflow-hidden md:block">
        <img
          src={SLIDE_CONTENT.slide2.image.src}
          alt={SLIDE_CONTENT.slide2.image.alt}
          className="ml-auto h-full object-cover"
        />
      </div>
    </div>,

    // SLIDE 3
    <div key="slide-3" className="flex h-full flex-col bg-white p-10 md:p-16">
      <h2 className="mb-10 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
        {SLIDE_CONTENT.slide3.title}
      </h2>
      <div className="flex grow flex-col justify-center">
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left text-sm md:text-base">
            <thead className="bg-slate-900 text-white">
              <tr>
                {SLIDE_CONTENT.slide3.headers.map((header, idx) => (
                  <th key={`th-${idx}`} className="px-6 py-4 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {SLIDE_CONTENT.slide3.rows.map((row, idx) => (
                <tr
                  key={row.layer}
                  className={
                    idx % 2 === 0
                      ? "transition-colors hover:bg-slate-50"
                      : "bg-slate-50 transition-colors hover:bg-slate-100"
                  }
                >
                  <td className="px-6 py-4 font-bold text-blue-700">
                    {row.layer}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.threat}</td>
                  <td className="px-6 py-4 text-slate-600">{row.control}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>,

    // SLIDE 4
    <div
      key="slide-4"
      className="flex h-full flex-col bg-slate-50 p-10 md:p-16"
    >
      <h2 className="mb-12 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
        {SLIDE_CONTENT.slide4.title}
      </h2>
      <div className="grid grow grid-cols-1 items-center gap-8 md:grid-cols-2">
        {SLIDE_CONTENT.slide4.domains.map((domain, idx) => (
          <div
            key={`domain-${idx}`}
            className="flex h-full flex-col justify-center rounded-xl border border-t-4 border-slate-200 border-t-blue-700 bg-white p-8 text-slate-900 shadow-sm"
          >
            <h3 className="mb-4 text-2xl leading-tight font-semibold">
              {domain.titlePrefix} <br />
              <span className="text-blue-700">{domain.titleHighlight}</span>
            </h3>
            <p className="text-lg leading-relaxed text-slate-600">
              {domain.description}
            </p>
          </div>
        ))}
      </div>
    </div>,
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 0 : prev - 1))
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide()
      if (e.key === "ArrowLeft") prevSlide()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  return (
    <div className="mx-auto my-8 w-full max-w-7xl font-sans">
      <div className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {slides[currentSlide]}

        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="pointer-events-auto rounded-full bg-white/90 p-3 text-slate-700 shadow-sm transition-all hover:bg-white hover:text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-30 disabled:hover:text-slate-700"
            aria-label="Previous Slide"
          >
            <HugeiconsIcon icon={ChevronLeft} size={24} />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="pointer-events-auto rounded-full bg-white/90 p-3 text-slate-700 shadow-md transition-all hover:bg-white hover:text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-30 disabled:hover:text-slate-700"
            aria-label="Next Slide"
          >
            <HugeiconsIcon icon={ChevronRight} size={24} />
          </button>
        </div>

        <div className="absolute right-0 bottom-6 left-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-6 bg-blue-700"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
