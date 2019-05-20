var physics = {

    objects: [],
    g: 9.81,

    turnOn: function () {

        for (let object of physics.objects) {
            object.move();
        }
    },

    PhysicArea: function (targetElement) {

        let area = {
            element: targetElement
        };
        area.element.style.position = "relative";

        return area;
    },

    PhysicObject: function (targetElement = null, mass = 0) {

        let object = {
            mass: mass,
            isMoveable: true,
            position: {
                x: 0,
                y: 0
            },
            vector: {
                dx: 0,
                dy: 0
            },
            element: targetElement,

            getWeight: function () {

                return object.mass * physics.g;
            },

            refreshPosition: function () {

                object.element.style.left = object.position.x + "px";
                object.element.style.top = object.position.y + "px";
            },

            move: function () {

                if (object.isMoveable) {
                    object.position.x += object.vector.dx;
                    object.position.y += object.vector.dy + object.getWeight();
                    object.refreshPosition();

                    requestAnimationFrame(object.move);
                }
            }
        };

        object.element.style.position = "absolute";

        physics.objects.push(object);

        return object;
    }
};

/*
 * TODO
 * Identify an element to be the "space" where inside occurs physics on children
 */

/*
 * Notes
 * Use of:
 *   Element​.get​Bounding​Client​Rect()
 *   element​.offsetTop
 *   element.offsetLeft
 *   element.offsetHeight
 *   element.offsetWidth
 */