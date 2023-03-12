import InfoBlockLayout from "@/components/layouts/InfoBlockLayout";

export interface Props {
    text: string;
}


export default function AboutBlock({ text }: Props) {


    return (
        <InfoBlockLayout title={"About Us"}>
            <span>{text}</span>
        </InfoBlockLayout>
    );
}

AboutBlock.displayName = "AboutBlock";