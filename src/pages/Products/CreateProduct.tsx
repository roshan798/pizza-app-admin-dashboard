import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    Select,
    InputNumber,
    Switch,
    Upload,
    type UploadFile,
    message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fetchCategories } from "../../http/Catalog/categories";
import type {
    Category,
    Product,
    ProductAttribute,
    ProductPriceConfiguration,
    ProductPriceType,
} from "../../http/Catalog/types";
import { createProduct } from "../../http/Catalog/products";
import { useState } from "react";

const { Title } = Typography;

interface Props {
    tenantId: string;
    onSuccess?: () => void;
}

interface ProductFormValues {
    name: string;
    description: string;
    categoryId: string;
    image?: UploadFile[];
    // For the UI we keep simple shapes; we’ll transform in handleSubmit
    priceConfiguration?: Record<string, Record<string, string | number> | string | number>;
    attributes?: Record<string, string | number | boolean>;
    isPublished: boolean;
}

const logFormData = (formData: FormData) => {
    for (const [key, value] of formData.entries()) {
        // File logs as [object File]
        console.log(key, value);
    }
};

// Helpers to serialize Map payloads
// const mapToObject = <T,>(m: Map<string, T>) =>
//     Object.fromEntries(Array.from(m.entries()));

const priceCfgToSerializable = (
    pc: Map<string, ProductPriceConfiguration>
)=> {
    const out: Record<string,{ priceType: ProductPriceType; availableOptions: Record<string, number> }>= {};
    for (const [groupKey, cfg] of pc.entries()) {
        out[groupKey] = {
            priceType: cfg.priceType,
            availableOptions: Object.fromEntries(cfg.availableOptions.entries()),
        };
    }
    return out;
};

export default function CreateProductForm({ tenantId = "1", onSuccess }: Props) {
    const [form] = Form.useForm<ProductFormValues>();
    const queryClient = useQueryClient();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // 1. Fetch all categories
    const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: () => fetchCategories().then((res) => res.data.data),
    });

    // 2. Product mutation
    const mutation = useMutation({
        mutationFn: (formData: FormData) => createProduct(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            form.resetFields();
            setFileList([]);
            setSelectedCategory(null);
            onSuccess?.();
            message.success("Product created");
        },
        onError: (err: unknown) => {
            console.error(err);
            message.error("Failed to create product");
        },
    });

    const handleSubmit = (values: ProductFormValues) => {
        if (!selectedCategory) return;

        // --- Build priceConfiguration as Map<string, ProductPriceConfiguration>
        const priceConfiguration = new Map<string, ProductPriceConfiguration>();

        Object.entries(selectedCategory.priceConfiguration).forEach(([groupKey, cfg]) => {
            // In the UI, each group can be either:
            // - A Select of options => we receive a string key that should map to a number later
            // - An InputNumber => we receive a single number for this group
            const fieldVal = values.priceConfiguration?.[groupKey];

            let availableOptionsMap = new Map<string, number>();

            if (fieldVal && typeof fieldVal === "object" && !Array.isArray(fieldVal)) {
                // Case: Record<string, string | number> (multiple options)
                const optionEntries: [string, number][] = Object.entries(
                    fieldVal as Record<string, string | number>
                ).map(([opt, val]) => [opt, Number(val)]);
                availableOptionsMap = new Map<string, number>(optionEntries);
            } else if (typeof fieldVal === "string" || typeof fieldVal === "number") {
                // Case: single numeric value for the group (e.g., base price)
                // Use a canonical key like "base" or the selected option as the key
                const keyForSingle = typeof fieldVal === "string" ? fieldVal : "base";
                const numVal = Number(fieldVal);
                if (!Number.isFinite(numVal)) {
                    console.warn(`Invalid numeric value for ${groupKey}:`, fieldVal);
                } else {
                    availableOptionsMap.set(keyForSingle, numVal);
                }
            }

            const vals: ProductPriceConfiguration = {
                priceType: cfg.priceType,
                availableOptions: availableOptionsMap,
            };

            priceConfiguration.set(groupKey, vals);
        });

        // --- Build attributes
        const attributes: ProductAttribute[] =
            (selectedCategory.attributes ?? []).map((attr) => {
                const raw = values.attributes?.[attr.name];

                let value: string | number | boolean;

                if (attr.widgetType === "switch") {
                    value = Boolean(raw);
                } else if (attr.widgetType === "radio") {
                    value = typeof raw === "number" ? raw : String(raw ?? "");
                } else {
                    value = raw as string | number | boolean;
                }

                return {
                    name: attr.name,
                    value,
                };
            }) || [];

        // --- Build payload (domain model with Maps)
        const payload: Omit<Product, "_id" | "createdAt" | "updatedAt"> = {
            name: values.name,
            description: values.description,
            tenantId,
            categoryId: selectedCategory.id!,
            priceConfiguration,
            attributes,
            isPublished: values.isPublished,
        };

        // --- Serialize for transport: convert Maps to objects
        const serializablePayload = {
            ...payload,
            priceConfiguration: priceCfgToSerializable(priceConfiguration),
        };

        // ✅ Create FormData for multipart
        const formData = new FormData();

        if (fileList.length > 0) {
            const rawFile = fileList[0].originFileObj as File | undefined;
            if (rawFile) {
                formData.append("image", rawFile, rawFile.name);
            }
        }

        formData.append("data", JSON.stringify(serializablePayload));

        // Debug
        console.log("📦 Final Payload (serialized):", serializablePayload);
        logFormData(formData);

        // --- Call mutation
        mutation.mutate(formData);
    };

    if (loadingCategories) return <div>Loading categories...</div>;

    return (
        <Card>
            <Title level={4}>Create Product</Title>

            text
            <Form<ProductFormValues>
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onFinishFailed={(err) => console.log("❌ Validation Failed:", err)}
                id="product-form"
                initialValues={{ isPublished: true }}
            >
                {/* Basic Info */}
                <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{ required: true, message: "Enter product name" }]}
                >
                    <Input placeholder="e.g. Pizza Deluxe" />
                </Form.Item>

                {/* Category Selector */}
                <Form.Item
                    label="Category"
                    name="categoryId"
                    rules={[{ required: true, message: "Select a category" }]}
                >
                    <Select
                        placeholder="Select a category"
                        onChange={(id) => {
                            const cat = categories?.find((c) => c.id === id) || null;
                            setSelectedCategory(cat);
                            // Reset dependent fields when category changes
                            form.setFieldsValue({ priceConfiguration: undefined, attributes: undefined });
                        }}
                    >
                        {categories?.map((cat) => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Enter description" }]}
                >
                    <Input.TextArea rows={3} placeholder="Enter product description" />
                </Form.Item>

                <Form.Item
                    label="Product Image"
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e?.fileList}
                    rules={[{ required: true, message: "Please upload an image" }]}
                >
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        beforeUpload={() => false} // prevent auto upload
                        maxCount={1} // allow only 1 image
                        onChange={({ fileList }) => setFileList(fileList)}
                    >
                        {fileList.length >= 1 ? null : (
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        )}
                    </Upload>
                </Form.Item>

                {/* Price Configurations */}
                {selectedCategory && (
                    <>
                        <Title level={5}>Price Configurations</Title>
                        {Object.entries(selectedCategory.priceConfiguration).map(([key, cfg]) => (
                            <Form.Item
                                key={key}
                                label={key}
                                name={["priceConfiguration", key]}
                                tooltip={
                                    cfg.priceType === "base"
                                        ? "Base price or option pricing for this group"
                                        : "Additional price added on top"
                                }
                            >
                                {cfg.availableOptions && cfg.availableOptions.length > 0 ? (
                                    // If you want multiple option prices, render one InputNumber per option instead of a single Select.
                                    // Here, Select means you’re choosing one option; price will be assigned under that key.
                                    <Select placeholder={`Select ${key} option`}>
                                        {cfg.availableOptions.map((opt) => (
                                            <Select.Option key={opt} value={opt}>
                                                {opt}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                ) : (
                                    <InputNumber
                                        min={0}
                                        style={{ width: "100%" }}
                                        placeholder={`Enter ${cfg.priceType} price`}
                                    />
                                )}
                            </Form.Item>
                        ))}

                        {/* Attributes */}
                        <Title level={5}>Attributes</Title>
                        {selectedCategory.attributes.map((attr) => (
                            <Form.Item
                                key={attr.name}
                                label={attr.name}
                                name={["attributes", attr.name]}
                                valuePropName={attr.widgetType === "switch" ? "checked" : "value"}
                                initialValue={
                                    attr.widgetType === "switch"
                                        ? Boolean(attr.defaultValue)
                                        : attr.defaultValue ?? undefined
                                }
                            >
                                {attr.widgetType === "radio" ? (
                                    <Select placeholder={`Select ${attr.name}`}>
                                        {attr.availableOptions.map((opt) => (
                                            <Select.Option key={opt} value={opt}>
                                                {opt}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                ) : attr.widgetType === "switch" ? (
                                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                                ) : (
                                    <Input placeholder="Enter value" />
                                )}
                            </Form.Item>
                        ))}
                    </>
                )}

                <Form.Item label="Published" name="isPublished" valuePropName="checked">
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={mutation.isPending} form="product-form">
                        Create Product
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}