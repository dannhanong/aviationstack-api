export interface Live {
    updated?: string;
    latitude?: number;
    longitude?: number;
    altitude?: number;
    direction?: number;
    speedHorizontal?: number;
    speedVertical?: number;
    isGround?: boolean;
}