export class Color {
    private r: number;
    private g: number;
    private b: number;


    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    get red(): number {
        return this.r;
    }

    get green(): number {
        return this.g;
    }

    get blue(): number {
        return this.b;
    }

    get hex(): string {
        return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
    }

    static fromHex(hex: string): Color {
        const r = parseInt(hex.substring(1, 2), 16);
        const g = parseInt(hex.substring(3, 2), 16);
        const b = parseInt(hex.substring(5, 2), 16);
        return new Color(r, g, b);
    }
}