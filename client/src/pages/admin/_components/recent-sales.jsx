import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jackson Davis</p>
          <p className="text-sm text-muted-foreground">
            jackson.davis@example.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$249.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>SO</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sophia Olson</p>
          <p className="text-sm text-muted-foreground">
            sophia.olson@example.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$399.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">William Kim</p>
          <p className="text-sm text-muted-foreground">
            william.kim@example.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$129.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>EM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Emma Martinez</p>
          <p className="text-sm text-muted-foreground">
            emma.martinez@example.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$199.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>LT</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Liam Thompson</p>
          <p className="text-sm text-muted-foreground">
            liam.thompson@example.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$349.00</div>
      </div>
    </div>
  );
}
