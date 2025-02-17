import { Button } from "@/components/Button";
import { FuelLogo } from "@/components/FuelLogo";
import { Input } from "@/components/Input";
import { AppContext } from "@/components/Layout";
import { Link } from "@/components/Link";
import { TestScriptAbi__factory } from "@/sway-api";
import { BN, BigNumberish, Script, bn } from "fuels";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ScriptExample() {
  const { burnerWallet } = useContext(AppContext);

  const [script, setScript] = useState<Script<[input: BigNumberish], BN>>();
  const [input, setInput] = useState<string>();
  const [result, setResult] = useState<string>();

  useEffect(() => {
    (async () => {
      if (burnerWallet) {
        const script = TestScriptAbi__factory.createInstance(burnerWallet);
        setScript(script);
      }

      // eslint-disable-next-line no-console
    })().catch(console.error);
  }, [burnerWallet]);

  const runScript = async () => {
    try {
      if (!script) {
        return toast.error("Script not loaded");
      }

      const { value } = await script.functions.main(bn(input)).call();

      setResult(value.toString());
    } catch (error) {
      console.error(error);
      toast.error("Error running script.");
    }
  };

  return (
    <>
      <div className="flex gap-4">
        <FuelLogo />
        <h3 className="text-2xl font-semibold">Script</h3>
      </div>

      <Input
        className="mt-8"
        value={input as string}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a number"
        type="number"
      />

      <Button onClick={runScript}>Run Script</Button>

      {result && (
        <div className="flex gap-4 align-baseline">
          <h5 className="font-semibold text-xl">Result:</h5>
          <p className="text-gray-400">{result}</p>
        </div>
      )}

      <span className="text-gray-400">
        This script takes a number and simply echoes it back.
      </span>

      <Link
        href="https://docs.fuel.network/docs/intro/glossary/#script"
        className="mt-4"
      >
        Learn more about Scripts
      </Link>

      <Link href="/" className="mt-12">
        Back to home
      </Link>
    </>
  );
}
