import { ReactNode } from "react";

interface DefaultWeightProps {
    children: ReactNode;
}

const DefaultWeight = ({children}: DefaultWeightProps) => {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-10 md:py-14 lg:py-16">
                {children}
            </div>
        </div>
    )
}

export default DefaultWeight
