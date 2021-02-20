import clsx from "clsx";
import React from "react";
import { useKeyPressEvent } from "react-use";
import { useNodesStore } from "../../globalState";
import { useSidebarState } from "./useSidebar";
import { ChevronRightOutline } from "@graywolfai/react-heroicons";

type NodeEditingSidebar = React.FC<React.HTMLAttributes<HTMLDivElement>> & {
  className?: string;
};

export const NodeEditingSidebar: NodeEditingSidebar = ({
  className,
  style,
  ...props
}) => {
  const [nodeId, closeSidebar, nodeType] = useSidebarState((state) => [
    state.nodeId,
    state.closeSidebar,
    state.nodeType,
  ]);

  const config = useNodesStore((state) => state.nodeTypes[nodeType]);
  console.log(config);

  const ref = React.useRef<HTMLDivElement>(null);

  useKeyPressEvent("Escape", () => closeSidebar());

  return (
    <div
      className={clsx(
        "w-full p-6 shadow-md space-y-8 overflow-y-scroll",
        className
      )}
      style={style}
      ref={ref}
      {...props}
    >
      <header className="flex justify-between items-start">
        <h2
          className="text-3xl font-semibold border-b-4 pb-1"
          style={{ borderColor: config.color }}
        >
          {nodeId}
        </h2>
        <button
          className="w-9 bg-gray-300 text-gray-600 clickable p-2"
          onClick={() => closeSidebar()}
        >
          <ChevronRightOutline />
        </button>
      </header>
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Unused Inputs</h3>
        <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Conditions</h3>
        <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Variables</h3>
        <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Question</h3>
        <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Answers</h3>
        <div className="w-full h-52 bg-gray-300 flex items-center justify-center text-xl">
          Filler
        </div>
      </section>
    </div>
  );
};

// Hook
function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  handler: (event: PointerEvent) => void
) {
  React.useEffect(() => {
    const listener = (event: PointerEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!(event.target instanceof Node)) return;
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      event.stopPropagation();
      handler(event);
    };

    document.addEventListener("pointerdown", listener);

    return () => {
      document.removeEventListener("pointerdown", listener);
    };
  }, [ref, handler]);
}
