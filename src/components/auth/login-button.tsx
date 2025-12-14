import { Button } from "@/components/ui/button";

import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function LoginButton() {
  const handleLogin = async () => {
    const data = await queryClient.fetchQuery({
      queryKey: ["login"],
      queryFn: async () => {
        const res = await fetch("http://localhost:3006/api/v1/users");

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        return res.json();
      },
    });

    console.log(data);
  };

  return (
    <Button variant="default" onClick={handleLogin}>
      Login
    </Button>
  );
}
