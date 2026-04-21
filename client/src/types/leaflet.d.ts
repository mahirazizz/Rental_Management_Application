// Suppress TypeScript errors for leaflet and react-leaflet
declare module "leaflet" {
  export * from "leaflet";

  export namespace L {
    function icon(options: Record<string, unknown>): unknown;
  }
}

declare module "react-leaflet" {
  export interface MapContainerProps {
    center?: [number, number];
    zoom?: number;
    className?: string;
    scrollWheelZoom?: boolean;
    children?: React.ReactNode;
    [key: string]: unknown;
  }

  export interface TileLayerProps {
    attribution?: string;
    url?: string;
    [key: string]: unknown;
  }

  export interface MarkerProps {
    position?: [number, number];
    icon?: unknown;
    children?: React.ReactNode;
    [key: string]: unknown;
  }

  export interface PopupProps {
    children?: React.ReactNode;
    [key: string]: unknown;
  }

  export const MapContainer: React.ComponentType<MapContainerProps>;
  export const TileLayer: React.ComponentType<TileLayerProps>;
  export const Marker: React.ComponentType<MarkerProps>;
  export const Popup: React.ComponentType<PopupProps>;
}
