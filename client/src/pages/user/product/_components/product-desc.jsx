export default function ProductDescription({ description }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Product Description</h2>
      <div className="prose max-w-none text-muted-foreground">
        <p className="leading-relaxed whitespace-pre-line">{description}</p>
      </div>
    </section>
  );
}
