import m from 'mithril';
import { Event } from '../Models'

interface DialAttributes {
    events: Event[];
    viewBoxXLength: number;
    viewBoxYLength: number;
}

export default class Dial implements m.ClassComponent<DialAttributes> {
    radius: number;
    strokeDashArray: number;
    xCoord: number;
    yCoord: number;

    constructor({ attrs }: m.CVnode<DialAttributes>) {
        this.radius = Math.min(attrs.viewBoxXLength, attrs.viewBoxYLength) * 0.4;
        this.xCoord = attrs.viewBoxXLength / 2;
        this.yCoord = attrs.viewBoxYLength / 2;
        this.strokeDashArray = this.radius * 2 * Math.PI;
    }

    private generateEventCircles(events: Event[]) {
        let newLocal = this;
        return events.map(function (event: Event) {
            return m('g', { transform: `rotate(${newLocal.calculateAngularOffsetHelper(event)} ${newLocal.xCoord} ${newLocal.yCoord})` },
                m('circle', {
                    cx: newLocal.xCoord.toString(),
                    cy: newLocal.yCoord.toString(),
                    r: newLocal.radius.toString(),
                    fill: "none",
                    "stroke": event.color,
                    "stroke-width": "2",
                    "stroke-dasharray": newLocal.strokeDashArray.toString(),
                    "stroke-dashoffset": newLocal.calculateStrokeDashOffsetHelper(event).toString()
                })
            );
        })
    }

    private calculateStrokeDashOffsetHelper(event: Event): number {
        // stroke-dashoffset related to duration
        return (1 - (event.duration / 24)) * this.strokeDashArray;
    }

    private calculateAngularOffsetHelper(event: Event): number {
        // realtes to timeStart
        return (event.timeStart / 24) * 360
    }

    view({ attrs }: m.CVnode<DialAttributes>) {
        return m('svg', { viewBox: `0 0 ${attrs.viewBoxXLength} ${attrs.viewBoxYLength}` }, [
            m(Indicator, { xCoord: this.xCoord, yCoord: this.yCoord, color: "white", radius: this.radius }),
            ...this.generateEventCircles(attrs.events)
        ])
    }
}

interface IndicatorAttributes {
    xCoord: number;
    yCoord: number;
    radius: number;
    color: string;
}

class Indicator implements m.ClassComponent<IndicatorAttributes> {
    date: Date;
    angularOffset: number;
    constructor({ attrs }: m.CVnode<IndicatorAttributes>) { }

    oninit({ attrs }: m.CVnode<IndicatorAttributes>) {
        this.date = new Date()
        this.angularOffset = (this.date.getHours() + (this.date.getMinutes() / 60)) * 360 / 24;
    }

    view({ attrs }: m.CVnode<IndicatorAttributes>) {
        return m("g", { transform: `${this.angularOffset} ${attrs.xCoord} ${attrs.yCoord}` },
            m("circle", {
                cx: attrs.xCoord.toString(),
                cy: attrs.yCoord.toString(),
                r: attrs.radius.toString(),
                fill: "none",
                "stroke": attrs.color,
                "stroke-width": "8",
                "stroke-dasharray": (2 * Math.PI * attrs.radius).toString(),
                "stroke-dashoffset": (2 * Math.PI * attrs.radius - 2).toString(),
                "stroke-linecap": "butt"
            })
        )
    }
}