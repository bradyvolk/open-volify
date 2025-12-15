import { serve } from "bun";
import index from "./index.html";

// Bun HTML server
serve({
  routes: {
    "/*": index,
  },
  port: 3001,
});
