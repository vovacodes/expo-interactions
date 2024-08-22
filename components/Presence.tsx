import {
  Children,
  createContext,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  SwitchTransition,
  Transition,
  TransitionStatus,
} from "react-transition-group";

const PresenceContext = createContext<{
  status: TransitionStatus;
  safeToRemove: () => void;
} | null>(null);

export function usePresence() {
  return useContext(PresenceContext);
}

export function Presence({
  children,
  stateKey,
}: {
  children: ({ stateKey }: { stateKey: string }) => ReactNode;
  stateKey: string;
}) {
  const done = useRef(() => {});

  const endListener = useCallback((_: unknown, d: () => void) => {
    done.current = d;
  }, []);

  const safeToRemove = useCallback(() => done.current(), []);

  // Filter out any children that aren't ReactElements. We can only track ReactElements with a props.key
  const elementChildren = onlyElements(children({ stateKey }));

  return (
    <SwitchTransition mode="out-in">
      <Transition key={stateKey} addEndListener={endListener}>
        {(status) => {
          return Children.map(elementChildren, (child) => (
            <PresenceProvider
              key={getChildKey(child)}
              safeToRemove={safeToRemove}
              status={status}
            >
              {child}
            </PresenceProvider>
          ));
        }}
      </Transition>
    </SwitchTransition>
  );
}

export function PresenceChild({
  children,
  onEntering,
  onExiting,
}: {
  children: ReactNode;
  onEntering?: () => void;
  onExiting?: (safeToRemove: () => void) => void;
}) {
  const presence = usePresence();
  if (!presence)
    throw new Error(
      "`PresenceChild` must be used within a `Presence` component"
    );

  const { status, safeToRemove } = presence;

  useEffect(() => {
    switch (status) {
      case "exiting": {
        onExiting ? onExiting(safeToRemove) : safeToRemove();
        break;
      }

      case "entering": {
        onEntering?.();
        break;
      }
    }
  }, [status]);

  return <>{children}</>;
}

function PresenceProvider({
  children,
  status,
  safeToRemove,
}: {
  children: ReactElement<any>;
  status: TransitionStatus;
  safeToRemove: () => void;
}) {
  const contextValue = useMemo(
    () => ({
      status,
      safeToRemove,
    }),
    [status, safeToRemove]
  );

  return (
    <PresenceContext.Provider value={contextValue}>
      {children}
    </PresenceContext.Provider>
  );
}

type ComponentKey = string | number;

function getChildKey(child: ReactElement<any>): ComponentKey {
  return child.key || "";
}

function onlyElements(children: ReactNode): ReactElement<any>[] {
  const filtered: ReactElement<any>[] = [];

  // We use forEach here instead of map as map mutates the component key by preprending `.$`
  Children.forEach(children, (child) => {
    if (isValidElement(child)) filtered.push(child);
  });

  return filtered;
}
