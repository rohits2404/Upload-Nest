import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./provider/theme-provider";
import { AppRoutes } from "./routes";

const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>
                <AppRoutes />
            </TooltipProvider>
        </ThemeProvider>
    );
};

export default App;
