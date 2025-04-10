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
    console.log('Analyzing recipe:', {
        title: recipe.title,
        hasInstructions: !!recipe.analyzedInstructions?.length,
        instructions: recipe.analyzedInstructions?.[0]?.steps?.map(step => ({
            text: step.step,
            equipment: step.equipment
        }))
    });

    if (!recipe) return new Set();

    const requiredAppliances = new Set();

    if (recipe.analyzedInstructions?.length > 0) {
        recipe.analyzedInstructions.forEach((instruction, idx) => {
            console.log(`Processing instruction ${idx}:`, {
                hasSteps: !!instruction.steps?.length,
                stepsCount: instruction.steps?.length
            });

            instruction.steps?.forEach((step, stepIdx) => {
                // Log step details
                console.log(`Step ${stepIdx}:`, {
                    text: step.step,
                    hasEquipment: !!step.equipment?.length,
                    equipment: step.equipment
                });

                // Process equipment
                step.equipment?.forEach(equipment => {
                    const equipmentName = equipment.name.toLowerCase();
                    console.log('Equipment found:', equipmentName);
                    
                    // Check categories
                    Object.entries(equipmentCategories.hasAsset).forEach(([appliance, data]) => {
                        if (data.equipment.includes(equipmentName)) {
                            console.log(`Matched equipment: ${equipmentName} -> ${appliance}`);
                            requiredAppliances.add(appliance);
                        }
                    });
                });

                // Check step text
                const stepText = step.step.toLowerCase();
                Object.entries(equipmentCategories.hasAsset).forEach(([appliance, data]) => {
                    const matchedIndicator = data.indicators.find(i => stepText.includes(i));
                    if (matchedIndicator) {
                        console.log(`Matched indicator in text: "${matchedIndicator}" -> ${appliance}`);
                        requiredAppliances.add(appliance);
                    }
                });
            });
        });
    }

    console.log('Final appliances for recipe:', {
        title: recipe.title,
        appliances: Array.from(requiredAppliances)
    });

    return requiredAppliances;
}