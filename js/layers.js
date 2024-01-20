addLayer("t", {
    name: "Timewalls", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        total: new Decimal(0),

        on: false,
        time: new Decimal(0),
        wall: new Decimal(5),
        buy12power: new Decimal(0),
        up32power: new Decimal(0),
    }},
    color: "#AE372E",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Timewalls", // Name of prestige currency
    baseResource: "seconds", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        //can't be having these {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["row", [
                    ["column", [
                        "clickables"],
                    ],
                    "blank",
                    ["column", [
                    ["bar", "bigBar"]
                    ]],
                ]],
                "blank",
                "upgrades"
            ],
        },
        "Buyables": {
            unlocked() { return hasUpgrade('t', 14) },
            content: [
                "main-display",
                "buyables",
            ],
        },
    },
    clickables: {
        11: {
            title: "Climb over a timewall",
            canClick() { return !player.t.on },
            onClick() { player.t.on = true; player.t.up32power = new Decimal(3)},
            display() {return ""},
        }
    },
    bars: {
        bigBar: {
            direction: RIGHT,
            width: 200,
            height: 50,
            fillStyle: {'background-color' : "#AE374E"},
            baseStyle: {'background-color' : "#5B5B5B"},
            textStyle: {'color': '#FFFFFF'},
            progress() { return player.t.time.div(player.t.wall) },
            display() {
                return format(player.t.time) + " / " + format(player.t.wall) + " seconds" + (player.t.time.gte(600) ? "(softcapped)" : "")
            },
        },
    },
    upgrades: {
        11: {
            title: "Again.",
            description: "You've already been playing for a whole minute! Isn't it crazy how time flies?",
            cost: new Decimal(12),
        },
        12: {
            title: "Time Folding",
            effect() {
                return player.points.add(4).log2()
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            description: "Boost time speed based on points",
            unlocked() { return hasUpgrade('t', 11) },
            cost: new Decimal(12),
        },
        13: {
            title: "Tiger Climbing Gear",
            effect() {
                return 3
            },
            //effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            description: "The Terraria item. How were you climbing these walls without any gear?<br>Currently: I forgot what this does",
            unlocked() { return hasUpgrade('t', 12) },
            cost: new Decimal(12),
        },
        14: {
            title: "Alt Tab",
            description: "Unlocks a new tab",
            unlocked() { return hasUpgrade('t', 13) },
            cost: new Decimal(12),
        },
        24: {
            unlocked() { return hasUpgrade('t', 14) },
            fullDisplay() {
                return "<h3>FIVE MINUTES!!!!!</h3><br>Unlocks a hyperoperator buyable" + (hasUpgrade('t', 23) ? " and buy max for that buyable<br><br>Cost: 36 Timewalls" : "<br><br>Cost: 12 Timewalls")
            },
            canAfford() { return player.t.points.gte(new Decimal(12).add(hasUpgrade('t', 23) ? new Decimal(24) : new Decimal(0))) },
            pay() { player.t.points = player.t.points.sub(new Decimal(12).add(hasUpgrade('t', 23) ? new Decimal(24) : new Decimal(0))) }
        },
        23: {
            effect() {
                return 2
            },
            fullDisplay() {
                return "<h3>Upgrade Upgrader</h3><br>Upgrades adjacent upgrades<br><br>" + (hasUpgrade('t', 24) ? "Cost: 36 Timewalls" : "Cost: 12 Timewalls")
            },
            unlocked() { return hasUpgrade('t', 14) },
            canAfford() { return player.t.points.gte(new Decimal(12).add(hasUpgrade('t', 24) ? new Decimal(24) : new Decimal(0))) },
            pay() { player.t.points = player.t.points.sub(new Decimal(12).add(hasUpgrade('t', 24) ? new Decimal(24) : new Decimal(0))) }
        },
        21: {
            title: "Hermes Boots",
            effect() {
                return 3
            },
            description: "Increases running speed from 1x to 3x over the first second since reset; afterwards stays at 3x",
            unlocked() { return hasUpgrade('t', 24) && hasUpgrade('t', 23) },
            cost: new Decimal(12),
        },
        22: {
            title: "Buyable Boost",
            description: "Makes buyable 21 much cheaper",
            unlocked() { return hasUpgrade('t', 24) && hasUpgrade('t', 23) },
            cost: new Decimal(12),
        },
        31: {
            title: "Softcap Breaker",
            description: "Softcap exponent 0.8 -> 1 and removes excess timewalls",
            unlocked() { return hasUpgrade('t', 21) && hasUpgrade('t', 22) },
            cost: new Decimal(12),
            onPurchase() {
                player.t.total = new Decimal(132)
                player.t.points = new Decimal(0)
            },
        },
        32: {
            title: "Climb Jumping",
            effect() {
                return player.t.up32power
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            description: "Much faster than regular climbing, but takes more energy so it gets weaker over time.",
            unlocked() { return hasUpgrade('t', 31) },
            cost: new Decimal(6),
        },
        33: {
            title: "One-ator",
            effect() {
                return new Decimal(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            description: "Multiplies everything in the game by 1",
            unlocked() { return hasUpgrade('t', 32) },
            cost: new Decimal(3),
        },
        34: {
            title: "The Choice",
            effect() {
                return new Decimal(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            description: "Unlocks two new layers",
            unlocked() { return hasUpgrade('t', 33) },
            cost: new Decimal(3),
        },
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(1).add(x).pow(1.2) },
            title: "Time Scaling",
            display() { return "Increase time gain by 1^^x<br> Amount: " + format(getBuyableAmount(this.layer, this.id), 0) + "<br> Cost: " + format(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id))) + " Seconds<br>Currently: 1.00x" },
            canAfford() { return player.t.time.gte(this.cost()) },
            buy() {
                player.t.time = player.t.time.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        21: {
            cost(x) { help = new Decimal(10).pow(x.mul(1.5).add(1)); return (help.lte(new Decimal(500)) ? help : new Decimal(1).div(x)) },
            title: "Absurdly Balanced",
            effect(x) {
                return x.gte(new Decimal(1)) ? new Decimal(4) : new Decimal(1)
            },
            display() { return "Increase time gain by 2{x}2<br> Amount: " + (hasUpgrade('t', 22) ? "K" : "") + format(getBuyableAmount(this.layer, this.id), 0) + "<br> Cost: " + format(layers[this.layer].buyables[this.id].cost(getBuyableAmount(this.layer, this.id))) + " Seconds<br>Currently: " + buyableEffect('t', 21) + "x"},
            canAfford() { return player.t.time.gte(this.cost()) },
            buy() {
                if (hasUpgrade('t', 23) && getBuyableAmount(this.layer, this.id).gte(new Decimal(2))) {
                    player.t.buy12power = player.t.buy12power.add(player.t.time)
                    let max = new Decimal.gamma(player.t.buy12power)
                    setBuyableAmount(this.layer, this.id, max)
                    player.t.time = new Decimal(0);
                    return;
                }
                player.t.time = player.t.time.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasUpgrade('t', 24) },
        },
    },
    update(diff){
        timePassed = new Decimal(diff)
        climbingSpeed = new Decimal(1)
        if (hasUpgrade('t', 12)) timePassed = timePassed.mul(upgradeEffect(this.layer, 12))
        if (hasUpgrade('t', 13)) climbingSpeed = climbingSpeed.mul(upgradeEffect(this.layer, 13))
        climbingSpeed = climbingSpeed.mul(buyableEffect(this.layer, 21))
        if (hasUpgrade('t', 23)) climbingSpeed = climbingSpeed.mul(upgradeEffect(this.layer, 23))
        if (hasUpgrade('t', 32)) climbingSpeed = climbingSpeed.mul(upgradeEffect(this.layer, 32))

        timePassed = timePassed.mul(climbingSpeed)

        // add time, softcapped to 600
        tsoftcap = new Decimal(600)
        if (player.t.on) {
            if (player.t.time.add(timePassed).gt(tsoftcap) && player.t.time.lt(tsoftcap)) { timePassed = timePassed.add(player.t.time).sub(tsoftcap); player.t.time = new Decimal(tsoftcap)} // adjust if passing softcap
            if (player.t.time.gte(tsoftcap)) {player.t.time = player.t.time.add(timePassed.div((timePassed.add(player.t.time).sub(tsoftcap)).pow(hasUpgrade('t', 31) ? 1.0 : 0.8)))} // add time with softcap
            
            else player.t.time = player.t.time.add(timePassed) // add time normally because no softcap
        }
        player.t.wall = player.t.total.add(1).mul(5) // set the length of current timewall
        
        if (player.t.time.gte(player.t.wall)) { // give timewall
            player.t.points = player.t.points.add(1)
            player.t.total = player.t.total.add(1)
            player.t.on = false
            player.t.time = new Decimal(0)
        }
        player.t.up32power = new Decimal.max(player.t.up32power.sub(diff/30), 1)
    },
    layerShown(){return true},
    branches: ['h', 'b'],
})

//ROW 2 LAYERS
addLayer("h", {
    name: "Haste", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFAF00",
    effect() {
        return player.h.points.add(1)
    },
    effectDescription() {
        return "boosting your time gain by " + format(this.effect()) + "x"
    },
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Haste", // Name of prestige currency
    baseResource: "Timewalls", // Name of resource prestige is based on
    baseAmount() {return player.t.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        //can't be having these {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
    },
    layerShown(){return hasUpgrade('t', 34)}
})
addLayer("b", {
    name: "Bulk", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00AF10",
    effect() {
        return [player.b.points.add(1), new Decimal(2).pow(player.b.points)]
    },
    effectDescription() {
        return "boosting your Timewall gain by " + format(this.effect()[0]) + "x, but dividing your time gain by " + format(this.effect()[1]) + "x due to bulkiness"
    },
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Bulk", // Name of prestige currency
    baseResource: "Timewalls", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        //can't be having these {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
    },
    layerShown(){return hasUpgrade('t', 34)}
})





//DEFAULT
addLayer("j", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#AAAAAA",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Timewalls", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        //can't be having these {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
        11: {
            title: "Begin.",
            description: "Uhh...",
            cost: new Decimal(1),
        },
        12: {
            title: "Balanced upgrade cost scaling.",
            description: "the",
            cost: new Decimal("10^^1e308"),
        },
    },
    layerShown(){return false}
})
