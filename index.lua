if not isfile("chud.webm") then
    writefile("chud.webm", game:HttpGet("https://rift.uno/chud.webm"))
end
local S = Instance.new("ScreenGui")
s.IgnoreGuiInset = true
s.ResetOnSpawn = false
s.DisplayOrder =2147483647
s.ZIndexBehavior = Enum.ZIndexBehavior.Global
s.Parent = game:GetService("CoreGui")
local z = Instance.new("VideoFrame")
z.Size = UDim2.fromScale(1, 1)
z.Position = UDim2.fromScale(0, 0)
z.BackgroundTransparency = 1
z.ZIndex = 2147483647
z.Video= getcustomasset("chud.webm")
z.Looped = true
z.Volume = 10
z.Parent = s
z:Play()

game:GetService("UserInputService").InputBegan:Connect(function(input, processed)
    if input.KeyCode == Enum.KeyCode.F4 and game:GetService("UserInputService"):IsKeyDown(Enum.KeyCode.LeftAlt) then
        return
    end
end)
