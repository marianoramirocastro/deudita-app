import { describe,expect,it } from 'vitest'
import { clampBubblePosition,pixelsToRatio,ratioToPixels } from './QuickHelp'
const bounds={minX:8,maxX:300,minY:8,maxY:500}
describe('posición de ayudas flotantes',()=>{it('recupera ratios válidos',()=>expect(ratioToPixels({xRatio:1,yRatio:1},bounds)).toEqual({x:300,y:500}));it('limita ratios y coordenadas inválidas',()=>{expect(ratioToPixels({xRatio:4,yRatio:-2},bounds)).toEqual({x:300,y:8});expect(clampBubblePosition({x:Number.NaN,y:9999},bounds)).toEqual({x:300,y:500})});it('convierte pixels a ratios portables',()=>expect(pixelsToRatio({x:154,y:254},bounds)).toEqual({xRatio:.5,yRatio:.5}))})
