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
    if (!recipe) return new Set();

    const requiredAppliances = new Set();
    console.log('Processing recipe:', {
        title: recipe.title,
        hasInstructions: !!recipe.analyzedInstructions?.length,
        firstStep: recipe.analyzedInstructions?.[0]?.steps?.[0]
    });

    if (recipe.analyzedInstructions?.length > 0) {
        recipe.analyzedInstructions.forEach((instruction) => {
            instruction.steps?.forEach((step) => {
                // Log each step's details
                console.log('Step details:', {
                    text: step.step,
                    equipment: step.equipment,
                });

                step.equipment?.forEach((equipment) => {
                    const equipmentName = equipment.name.toLowerCase();
                    console.log('Checking equipment:', {
                        name: equipmentName,
                        categories: Object.keys(equipmentCategories.hasAsset)
                    });
                });

                // Check step text
                const stepText = step.step.toLowerCase();
                Object.entries(equipmentCategories.hasAsset).forEach(([appliance, data]) => {
                    const foundIndicator = data.indicators.find(i => stepText.includes(i));
                    if (foundIndicator) {
                        console.log('Found indicator:', {
                            appliance,
                            indicator: foundIndicator,
                            stepText
                        });
                        requiredAppliances.add(appliance);
                    }
                });
            });
        });
    }

    return requiredAppliances;
}