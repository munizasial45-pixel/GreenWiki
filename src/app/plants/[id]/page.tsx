import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPlantById, getAllPlants, getRelatedPlants } from '../../../lib/plants';
import { PlantDetailView } from '../../../components/PlantDetailView';

interface PlantPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const plants = getAllPlants();
  return plants.map((plant) => ({
    id: plant.id,
  }));
}

export async function generateMetadata({ params }: PlantPageProps): Promise<Metadata> {
  const { id } = await params;
  const plant = getPlantById(id);

  if (!plant) {
    return {
      title: 'Plant Not Found | GreenWiki',
    };
  }

  return {
    title: `${plant.commonName} (${plant.scientificName}) Care Guide`,
    description: `Complete growing guide for ${plant.commonName}: watering rhythms, sunlight intensity, best planting season, and troubleshooting tips.`,
    openGraph: {
      title: `${plant.commonName} Care Guide | GreenWiki`,
      description: plant.description,
      images: [
        {
          url: plant.imageUrl,
          width: 800,
          height: 600,
          alt: plant.commonName,
        },
      ],
    },
  };
}

export default async function PlantDetailPage({ params }: PlantPageProps) {
  const { id } = await params;
  const plant = getPlantById(id);

  if (!plant) {
    notFound();
  }

  const related = getRelatedPlants(plant, 4);

  return <PlantDetailView plant={plant} relatedPlants={related} />;
}
