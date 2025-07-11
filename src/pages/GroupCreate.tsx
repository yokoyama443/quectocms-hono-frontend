import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroup } from "../libs/v1/group";
import type { Group } from "../types";
import { PageLayout } from "../components/layout";
import { Card, CardHeader, CardContent } from "../components/ui";
import { GroupForm } from "../components/forms";

export const GroupCreatePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCreateGroup = async (name: string) => {
        setIsLoading(true);
        setError("");
        
        try {
            const groupData: Group = {
                id: 0,
                name: name,
                created_at: ""
            };
            
            const createGroupResponse = await createGroup(groupData);
            if (createGroupResponse === null) {
                setError("グループ作成に失敗しました。再度お試しください。");
                return;
            }
            
            navigate(`/group/${createGroupResponse.id}`);
        } catch (error) {
            setError("グループ作成中にエラーが発生しました。");
            console.error("Create group error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/group");
    };

    return (
        <PageLayout 
            title="グループ作成 - QuectoCMS"
            maxWidth="md"
        >
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-bold text-gray-900">
                        新しいグループを作成
                    </h1>
                    <p className="text-gray-600 mt-2">
                        記事やコンテンツを整理するためのグループを作成しましょう
                    </p>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    
                    <GroupForm
                        onSubmit={handleCreateGroup}
                        onCancel={handleCancel}
                        isLoading={isLoading}
                        submitLabel="グループを作成"
                    />
                </CardContent>
            </Card>
        </PageLayout>
    );
}
