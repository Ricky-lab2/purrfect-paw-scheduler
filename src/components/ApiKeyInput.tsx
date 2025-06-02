
import { useState, useEffect } from "react";
import { Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

export function ApiKeyInput({ onApiKeySet }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isStored, setIsStored] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("openai_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
      onApiKeySet(storedKey);
    }
  }, [onApiKeySet]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey.trim());
      setIsStored(true);
      onApiKeySet(apiKey.trim());
    }
  };

  const handleClear = () => {
    localStorage.removeItem("openai_api_key");
    setApiKey("");
    setIsStored(false);
    onApiKeySet("");
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Key className="h-4 w-4" />
          OpenAI API Key Required
        </CardTitle>
        <CardDescription className="text-xs">
          Enter your OpenAI API key to enable AI-powered pet care assistance. 
          Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
          <Button onClick={handleSave} size="sm" disabled={!apiKey.trim()}>
            Save
          </Button>
        </div>
        {isStored && (
          <div className="flex items-center justify-between text-xs text-green-600">
            <span>✓ API key saved locally</span>
            <Button variant="ghost" size="sm" onClick={handleClear} className="h-auto p-1 text-xs">
              Clear
            </Button>
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          <p><strong>Privacy:</strong> Your API key is stored locally in your browser and never sent to our servers.</p>
        </div>
      </CardContent>
    </Card>
  );
}
