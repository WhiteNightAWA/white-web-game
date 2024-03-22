export function generateBox(t: string): Object {
    // t: "Left Right Top Bottom [ Dash Selected ] "
    let sx = {
        height: "5em",
        width: "5em",
        borderLeft: "none",
        borderRight: "none",
        borderTop: "none",
        borderBottom: "none",
    }

    if (t.includes("D")) {
        sx.borderLeft = "3px dashed rgba(255,255,255,0.125)";
        sx.borderRight = "3px dashed rgba(255,255,255,0.125)";
        sx.borderTop = "3px dashed rgba(255,255,255,0.125)";
        sx.borderBottom = "3px dashed rgba(255,255,255,0.125)";
        if (t.includes("S")) {
            sx.borderLeft = "3px solid white";
            sx.borderRight = "3px solid white";
            sx.borderTop = "3px solid white";
            sx.borderBottom = "3px solid white";

            if (t.includes("l")) sx.borderLeft = "3px dashed rgba(255,255,255,0.125)";
            if (t.includes("r")) sx.borderRight = "3px dashed rgba(255,255,255,0.125)";
            if (t.includes("t")) sx.borderTop = "3px dashed rgba(255,255,255,0.125)";
            if (t.includes("b")) sx.borderBottom = "3px dashed rgba(255,255,255,0.125)";
        }
    } else {
        sx.borderLeft = "3px solid white";
        sx.borderRight = "3px solid white";
        sx.borderTop = "3px solid white";
        sx.borderBottom = "3px solid white";
    }

    if (t.includes("L")) sx.borderLeft = "none";
    if (t.includes("R")) sx.borderRight = "none";
    if (t.includes("T")) sx.borderTop = "none";
    if (t.includes("B")) sx.borderBottom = "none";

    return sx
}

