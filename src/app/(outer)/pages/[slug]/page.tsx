import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "prisma/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPage(slug: string) {
  try {
    const page = await prisma.outerPages.findFirst({
      where: {
        slug: slug,
      },
      select: {
        id: true,
        page_id: true,
        slug: true,
        title: true,
        content: true,
        created_at: true,
        updated_at: true,
      },
    });

    return page;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${page.title} - Paymefans Store`,
    description: `Read ${page.title} for Paymefans Store`,
  };
}

export default async function OuterPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
          {page.title}
        </h1>
        <div
          className="outer-page-content
                        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h1]:text-gray-900 dark:[&_h1]:text-white
                        [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:text-gray-900 dark:[&_h2]:text-white
                        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-gray-900 dark:[&_h3]:text-white
                        [&_p]:mb-4 [&_p]:text-gray-700 dark:[&_p]:text-gray-300 [&_p]:leading-relaxed
                        [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline [&_a]:hover:text-blue-800 dark:[&_a]:hover:text-blue-300
                        [&_strong]:font-bold [&_strong]:text-gray-900 dark:[&_strong]:text-white
                        [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:text-gray-700 dark:[&_ul]:text-gray-300
                        [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:text-gray-700 dark:[&_ol]:text-gray-300
                        [&_li]:mb-2 [&_li]:text-gray-700 dark:[&_li]:text-gray-300
                        [&_.keep-styles]:**:text-inherit!"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}

