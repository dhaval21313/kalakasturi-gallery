import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getCategorySlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RedirectProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const product = docSnap.data();
      const categorySlug = getCategorySlug(product.category || 'gallery');
      redirect(`/products/${categorySlug}/${id}`);
    }
  } catch (err) {
    console.error("Redirect page error:", err);
  }
  
  redirect('/collections');
}
