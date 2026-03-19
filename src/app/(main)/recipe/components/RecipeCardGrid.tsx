import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const items = [
  {
    id: 1,
    title: "Mountain",
    image: "https://placehold.co/600x400",
  },
  {
    id: 2,
    title: "Ocean",
    image: "https://placehold.co/300x400",
  },
]

export default function RecipeCardGrid() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Beautiful view of {item.title}.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}