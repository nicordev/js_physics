var physics = {

    areas: [],

    /**
     * Add physic areas and objects to physics from arrays of DOM elements
     *
     * @param areaElements
     * @param options
     */
    init: function (
        areaElements = [],
        options = {
            addChildren: true,
            childrenMasses: 1,
            g: 9.81
        }
    ) {

        for (let areaElement of areaElements) {
            physics.PhysicArea(areaElement, options);
        }
    },

    /**
     * Apply the wonderful laws of physics!
     */
    start: function () {

        for (let area of physics.areas) {
            area.start();
        }
    },

    /**
     * Freeze all physic objects
     */
    freeze: function () {

        for (let area of physics.areas) {
            area.freeze();
        }
    },

    /**
     * Set the g value for every areas
     *
     * @param g
     */
    setG: function (g = 9.81) {

        for (let area of physics.areas) {
            area.g = g;
        }
    },

    /**
     * PhysicArea constructor
     *
     * @param targetElement
     * @param options
     * @returns {{limits: {x: number, y: number}, element: *}}
     * @constructor
     */
    PhysicArea: function (
        targetElement,
        options = {
            addChildren: false,
            childrenMasses: 0,
            g: 9.81
        }
    ) {

        let area = {
            g: options.g || 9.81,
            element: targetElement,
            limits: {
                x: targetElement.offsetWidth,
                y: targetElement.offsetHeight
            },
            objects: [],

            /**
             * Add a physic object to the area
             *
             * @param object
             */
            addObject: function (object) {

                area.objects.push(object);
            },

            /**
             * Apply the wonderful laws of physics in the area!
             */
            start: function () {

                for (let object of area.objects) {
                    object.isMoveable = true;
                    object.move();
                }
            },

            /**
             * Freeze all physic objects in the area
             */
            freeze: function () {

                for (let object of area.objects) {
                    object.isMoveable = false;
                }
            }
        };
        area.element.style.position = "relative";

        // Add children elements
        if (options.addChildren) {
            let childrenElements = area.element.children,
                positions = getXYValues(childrenElements);

            if (Array.isArray(options.childrenMasses)) {
                for (let i = 0,
                         j = 0,
                         size = childrenElements.length,
                         massesCount = options.childrenMasses.length;
                     i < size;
                     i++, j++) {
                    area.addObject(
                        physics.PhysicObject(
                            childrenElements[i],
                            area,
                            options.childrenMasses[j],
                            positions.xValues[i],
                            positions.yValues[i]
                        )
                    );
                    if (j >= massesCount) {
                        j = massesCount - 1;
                    }
                }

            } else {
                for (let i = 0, size = childrenElements.length; i < size; i++) {
                    area.addObject(
                        physics.PhysicObject(
                            childrenElements[i],
                            area,
                            options.childrenMasses || 0,
                            positions.xValues[i],
                            positions.yValues[i]
                        )
                    );
                }
            }
        }

        physics.areas.push(area);

        return area;

        /**
         * Get the offsetLeft and offsetTop value of the element. Do this before applying "absolute" position to elements
         *
         * @param objectElements
         * @returns {{yValues: Array, xValues: Array}}
         */
        function getXYValues(objectElements) {

            let xValues = [],
                yValues = [];

            for (let objectElement of objectElements) {
                xValues.push(objectElement.offsetLeft);
                yValues.push(objectElement.offsetTop);
            }

            return {
                xValues: xValues,
                yValues: yValues
            }
        }
    },

    /**
     * PhysicObject constructor
     *
     * @param targetElement
     * @param area
     * @param mass
     * @param x
     * @param y
     * @returns {{isMoveable: boolean, move: move, getWeight: (function(): number), mass: number, vector: {dx: number, dy: number}, position: {x: number, y: number}, refreshPosition: refreshPosition, element: *}}
     * @constructor
     */
    PhysicObject: function (targetElement, area, mass = 0, x = null, y = null) {

        let object = {
            area: area,
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

                return object.mass * object.area.g;
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