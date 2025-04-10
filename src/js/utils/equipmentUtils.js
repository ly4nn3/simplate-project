import { equipmentCategories } from "../../data/equipment-categories.js";

export function categorizeEquipment(equipmentList) {
    if (!Array.isArray(equipmentList)) {
        return {
            display: [],
            required: [],
            optional: [],
            specialized: [],
            hasSpecializedEquipment: false,
        };
    }

    const categorized = {
        display: [],
        required: [],
        optional: [],
        specialized: [],
    };

    equipmentList.forEach((item) => {
        if (!item) return;

        const equipment = item.toLowerCase();

        let foundInAssets = false;

        for (const { equipment: equipmentList } of Object.values(
            equipmentCategories.hasAsset
        )) {
            if (equipmentList.includes(equipment)) {
                categorized.display.push(equipment);
                foundInAssets = true;
                break;
            }
        }

        if (!foundInAssets) {
            if (equipmentCategories.general.essential.includes(equipment)) {
                categorized.required.push(equipment);
            } else if (
                equipmentCategories.general.optional.includes(equipment)
            ) {
                categorized.optional.push(equipment);
            } else if (equipmentCategories.specialized.includes(equipment)) {
                categorized.specialized.push(equipment);
            }
        }
    });

    return {
        ...categorized,
        hasSpecializedEquipment: categorized.specialized.length > 0,
    };
}

export function getRequiredAppliances(recipe) {
    console.log('Processing recipe:', {
        title: recipe.title,
        hasInstructions: !!recipe.analyzedInstructions?.length
    });

    if (!recipe) return new Set();

    const requiredAppliances = new Set();

    // Check equipment in 'analyzed instructions'
    if (recipe.analyzedInstructions?.length > 0) {
        recipe.analyzedInstructions.forEach((instruction) => {
            console.log('Instruction steps:', instruction.steps?.length);
            
            instruction.steps?.forEach((step) => {
                console.log('Step equipment:', step.equipment);
                console.log('Step text:', step.step);

                // Process equipment
                step.equipment?.forEach((equipment) => {
                    const equipmentName = equipment.name.toLowerCase();
                    console.log('Checking equipment:', equipmentName);

                    // Check equipment from categories
                    for (const [appliance, data] of Object.entries(
                        equipmentCategories.hasAsset
                    )) {
                        if (data.equipment.includes(equipmentName)) {
                            console.log(`Found appliance match: ${appliance}`);
                            requiredAppliances.add(appliance);
                        }
                    }
                });

                // Check step text
                const stepText = step.step.toLowerCase();
                for (const [appliance, data] of Object.entries(
                    equipmentCategories.hasAsset
                )) {
                    if (
                        data.indicators.some((indicator) =>
                            stepText.includes(indicator)
                        )
                    ) {
                        console.log(`Found indicator match: ${appliance}`);
                        requiredAppliances.add(appliance);
                    }
                }
            });
        });
    }

    console.log('Required appliances for recipe:', Array.from(requiredAppliances));
    return requiredAppliances;
}
