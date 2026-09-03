type Args = {
  params: Promise<{ slug?: string[] }>;
};

// Placeholder — la resolución real contra Payload (pages, accommodations,
// entities, articles) llega en HU-008 (docs/arquitectura/paginas-routing.md).
export default async function CatchAllPage({ params }: Args) {
  const { slug } = await params;

  return (
    <main>
      <p>Ruta /{(slug ?? []).join('/')} — pendiente de HU-008.</p>
    </main>
  );
}
