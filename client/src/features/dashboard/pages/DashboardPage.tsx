import ItemCard from '../components/ItemCard';

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ItemCard id="ENCHANTED_DIAMOND" name="Enchanted Diamond" />
    </div>
  );
}
