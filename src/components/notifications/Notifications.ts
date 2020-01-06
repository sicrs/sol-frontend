import m from 'mithril';
import { MDCRipple } from '@material/ripple';

interface NotificationsAttributes {
    data: NotificationAttributes[];
}

export default class Notifications implements m.ClassComponent<NotificationsAttributes> {
    constructor({ attrs }: m.CVnode<NotificationsAttributes>) { }
    view({ attrs }: m.CVnode<NotificationsAttributes>) {
        return m("div.notifications", [
            ...attrs.data.map(function (notif) {
                return m(Notification, notif)
            })
        ]);
    }
}

interface NotificationAttributes {
    title: string;
    message: string;
    action: string;
    id: string
}

class Notification implements m.ClassComponent<NotificationAttributes> {
    id: string;
    constructor({ attrs }: m.CVnode<NotificationAttributes>) {
        this.id = attrs.id;
        console.log(this.id)
    }

    dismissNotification(id: string) {
        return function () {
            document.querySelector(".notifications").removeChild(document.getElementById(id))
        }
    }

    oninit({ attrs }: m.CVnode<NotificationAttributes>) {
        console.log(attrs.id);
        this.id = attrs.id
    }

    oncreate({ attrs }: m.CVnode<NotificationAttributes>) {
        //MDCRipple.attachTo(document.getElementById('card-' + this.id));
        //MDCRipple.attachTo(document.querySelector(".mdc-ripple-surface"));
        MDCRipple.attachTo(document.querySelector(`.${'card-' + this.id} .mdc-button`))
    }

    view({ attrs }: m.CVnode<NotificationAttributes>) {
        return m(`div.notification.mdc-card.${'card-' + this.id}`, {id: 'card-' + this.id}, [
            m("div.notification-title", attrs.title),
            m("div.notification-message", attrs.message),
            m("div.notification-actions", [
                m("button.notification-dismiss.mdc-button", { onclick: this.dismissNotification(attrs.id) }, [
                    m("div.mdc-button__ripple"),
                    m("div.mdc-button__label", "Dismiss")
                ]),
                (attrs.action ? m("a.notification-action.mdc-button", {href: attrs.action}, [
                    m("div.mdc-button__ripple"),
                    m("div.mdc-button__label", "View")
                ]) : null)
            ])
        ])
    }
}
