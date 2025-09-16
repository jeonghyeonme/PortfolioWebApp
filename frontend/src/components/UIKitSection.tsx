import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Play, Pause, Heart, Share, 
  Star, Sun, Moon, Palette,
  Code, Copy, Check
} from 'lucide-react';

export function UIKitSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);
  const [progressValue, setProgressValue] = useState(75);
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null);

  const handleCopy = (componentCode: string, componentName: string) => {
    navigator.clipboard.writeText(componentCode);
    setCopiedComponent(componentName);
    setTimeout(() => setCopiedComponent(null), 2000);
  };

  const componentSections = [
    {
      title: '버튼 & 인터랙션',
      components: [
        {
          name: 'Primary Button',
          code: `<Button>Click me</Button>`,
          demo: <Button>Primary Button</Button>
        },
        {
          name: 'Secondary Button',
          code: `<Button variant="secondary">Secondary</Button>`,
          demo: <Button variant="secondary">Secondary Button</Button>
        },
        {
          name: 'Icon Button',
          code: `<Button size="icon"><Heart className="w-4 h-4" /></Button>`,
          demo: (
            <Button 
              size="icon" 
              variant={isLiked ? "default" : "outline"}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          )
        }
      ]
    },
    {
      title: '폼 컨트롤',
      components: [
        {
          name: 'Input Field',
          code: `<Input placeholder="Enter your email" />`,
          demo: <Input placeholder="Enter your email" className="max-w-xs" />
        },
        {
          name: 'Switch',
          code: `<Switch />`,
          demo: <Switch />
        },
        {
          name: 'Slider',
          code: `<Slider defaultValue={[50]} max={100} step={1} />`,
          demo: (
            <div className="w-48">
              <Slider 
                value={sliderValue} 
                onValueChange={setSliderValue}
                max={100} 
                step={1} 
              />
              <p className="text-sm text-muted-foreground mt-2">Value: {sliderValue[0]}</p>
            </div>
          )
        }
      ]
    },
    {
      title: '피드백 & 상태',
      components: [
        {
          name: 'Progress Bar',
          code: `<Progress value={75} />`,
          demo: (
            <div className="w-48">
              <Progress value={progressValue} />
              <p className="text-sm text-muted-foreground mt-2">{progressValue}% complete</p>
            </div>
          )
        },
        {
          name: 'Badge',
          code: `<Badge>New</Badge>`,
          demo: (
            <div className="flex gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          )
        },
        {
          name: 'Loading State',
          code: `<Button disabled>Loading...</Button>`,
          demo: <Button disabled>Loading...</Button>
        }
      ]
    },
    {
      title: '사용자 인터페이스',
      components: [
        {
          name: 'Avatar',
          code: `<Avatar><AvatarFallback>KD</AvatarFallback></Avatar>`,
          demo: (
            <div className="flex gap-2">
              <Avatar>
                <AvatarFallback>KD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          )
        },
        {
          name: 'Media Controls',
          code: `<Button><Play className="w-4 h-4" /></Button>`,
          demo: (
            <div className="flex gap-2">
              <Button 
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="icon" variant="outline">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl mb-4">UI 키트</h2>
          <p className="text-muted-foreground text-lg">
            재사용 가능한 컴포넌트 라이브러리와 디자인 시스템을 소개합니다
          </p>
        </motion.div>

        {/* Design System Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                디자인 시스템
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="mb-3">컬러 팔레트</h4>
                  <div className="flex gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary"></div>
                    <div className="w-8 h-8 rounded-full bg-secondary"></div>
                    <div className="w-8 h-8 rounded-full bg-accent"></div>
                    <div className="w-8 h-8 rounded-full bg-muted"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    접근성을 고려한 대비율과 일관된 색상 체계
                  </p>
                </div>
                
                <div>
                  <h4 className="mb-3">타이포그래피</h4>
                  <div className="space-y-1">
                    <div className="text-2xl">Heading</div>
                    <div className="text-base">Body Text</div>
                    <div className="text-sm text-muted-foreground">Caption</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    명확한 위계와 가독성 중심의 타이포그래피
                  </p>
                </div>
                
                <div>
                  <h4 className="mb-3">간격 시스템</h4>
                  <div className="space-y-2">
                    <div className="h-2 bg-primary/20 w-4"></div>
                    <div className="h-2 bg-primary/40 w-8"></div>
                    <div className="h-2 bg-primary/60 w-12"></div>
                    <div className="h-2 bg-primary/80 w-16"></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    8px 기반의 일관된 간격 체계
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Component Showcase */}
        <Tabs defaultValue="buttons" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="buttons">버튼</TabsTrigger>
            <TabsTrigger value="forms">폼</TabsTrigger>
            <TabsTrigger value="feedback">피드백</TabsTrigger>
            <TabsTrigger value="ui">UI 요소</TabsTrigger>
          </TabsList>

          {componentSections.map((section, sectionIndex) => (
            <TabsContent key={section.title} value={['buttons', 'forms', 'feedback', 'ui'][sectionIndex]}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.components.map((component, index) => (
                  <motion.div
                    key={component.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{component.name}</CardTitle>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopy(component.code, component.name)}
                          >
                            {copiedComponent === component.name ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          {/* Demo */}
                          <div className="flex items-center justify-center p-6 bg-background rounded-lg border">
                            {component.demo}
                          </div>
                          
                          {/* Code */}
                          <div className="bg-muted p-3 rounded-lg">
                            <code className="text-sm text-muted-foreground">
                              {component.code}
                            </code>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>인터랙티브 데모</CardTitle>
              <p className="text-muted-foreground">
                실제 컴포넌트들이 어떻게 상호작용하는지 체험해보세요
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Music Player Demo */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar>
                    <AvatarFallback>
                      <Star className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="text-sm">Sample Track</h4>
                    <p className="text-xs text-muted-foreground">Artist Name</p>
                    <Progress value={progressValue} className="mt-2" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                    <Button 
                      size="icon"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground text-center">
                  이 컴포넌트들은 실제 프로젝트에서 사용할 수 있도록 
                  TypeScript로 작성되었으며, 접근성과 사용자 경험을 고려하여 설계되었습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}