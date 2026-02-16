// Suppress TypeScript errors for leaflet and react-leaflet
declare module "leaflet" {
  export * from "leaflet";
  
  export namespace L {
    function icon(options: any): any;
  }
}

declare module "react-leaflet" {
  export interface MapContainerProps {
    center?: [number, number];
    zoom?: number;
    className?: string;
    scrollWheelZoom?: boolean;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface TileLayerProps {
    attribution?: string;
    url?: string;
    [key: string]: any;
  }

  export interface MarkerProps {
    position?: [number, number];
    icon?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface PopupProps {
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const MapContainer: React.ComponentType<MapContainerProps>;
  export const TileLayer: React.ComponentType<TileLayerProps>;
  export const Marker: React.ComponentType<MarkerProps>;
  export const Popup: React.ComponentType<PopupProps>;
}
