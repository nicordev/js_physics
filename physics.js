var physics = {

    areas: [],
    objects: [],
    g: 9.81,

    /**
     * Add physic areas and objects to physics from arrays of DOM elements
     *
     * @param spaceElements
     * @param boxElements
     * @param masses
     */
    init: function (spaceElements = null, boxElements = null, masses = 0) {

        if (spaceElements) {
            for (let spaceElement of spaceElements) {
                physics.PhysicArea(spaceElement);
            }
        }

        if (boxElements) {
            let xValues = [],
                yValues = [];

            for (let boxElement of boxElements) {
                xValues.push(boxElement.offsetLeft);
                yValues.push(boxElement.offsetTop);
            }

            if (Array.isArray(masses)) {
                let i = 0,
                    j = 0,
                    size = masses.length;
                for (let boxElement of boxElements) {
                    physics.PhysicObject(boxElement, masses[i], xValues[j], yValues[j]);
                    i++;
                    j++;
                    if (i >= size) {
                        i = size - 1;
                    }
                }

            } else {
                let i = 0;
                for (let boxElement of boxElements) {
                    physics.PhysicObject(boxElement, masses, xValues[i], yValues[i]);
                }
            }
        }
    },

    /**
     * Apply the wonderful laws of physics!
     */
    start: function () {

        for (let object of physics.objects) {
            object.isMoveable = true;
            object.move();
        }
    },

    /**
     * Freeze all physic objects
     */
    freeze: function () {

        for (let object of physics.objects) {
            object.isMoveable = false;
        }
    },

    /**
     * PhysicArea constructor
     *
     * @param targetElement
     * @returns {{limits: {x: number, y: number}, element: *}}
     * @constructor
     */
    PhysicArea: function (targetElement) {

        let area = {
            element: targetElement,
            limits: {
                x: targetElement.offsetWidth,
                y: targetElement.offsetHeight
            }
        };
        area.element.style.position = "relative";

        physics.areas.push(area);

        return area;
    },

    /**
     * PhysicObject constructor
     *
     * @param targetElement
     * @param mass
     * @param x
     * @param y
     * @returns {{isMoveable: boolean, move: move, getWeight: (function(): number), mass: number, vector: {dx: number, dy: number}, position: {x: number, y: number}, refreshPosition: refreshPosition, element: *}}
     * @constructor
     */
    PhysicObject: function (targetElement, mass = 0, x = null, y = null) {

        let object = {
            mass: mass,
            isMoveable: true,
            position: {
                x: x || targetElement.offsetLeft,
                y: y || targetElement.offsetTop
            },
            vector: {
                dx: 0,
                dy: 0
            },
            element: targetElement,

            /**
             * Calculate the weight of the object
             *
             * @returns {number}
             */
            getWeight: function () {

                return object.mass * physics.g;
            },

            /**
             * Refresh the position of the object
             */
            refreshPosition: function () {

                object.element.style.left = object.position.x + "px";
                object.element.style.top = object.position.y + "px";
            },

            /**
             * Move the object using its vector
             */
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
        object.refreshPosition();

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