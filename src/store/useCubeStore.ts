import { create } from "zustand"
import { Cube } from "../utils/Cube"

type Store = {
    cube: Cube
    setCube: (cube: Cube) => void
}

export const useCubeStore = create<Store>((set) => ({
    cube: new Cube(),
    setCube(cube) {
        set({ cube })
    },
}))